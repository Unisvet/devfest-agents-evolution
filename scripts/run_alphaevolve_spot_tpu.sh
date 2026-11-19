#!/usr/bin/env bash
# ==============================================================================
# Zero-Leak Ephemeral Spot Cloud TPU Wrapper for Google AlphaEvolve
# DevFest Stuttgart 2026 — Verified with Antigravity 2.0 & gcloud compute tpus
# ==============================================================================
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:?Set GCP_PROJECT_ID in .env or environment}"
ZONE="${GCP_TPU_ZONE:-europe-west4-a}"          # Trillium v6e zone (EU-friendly for Stuttgart!)
TPU_NAME="${GCP_TPU_NAME:-alphaevolve-tpu}"
ACCEL_TYPE="${GCP_TPU_TYPE:-v6e-1}"             # Single-chip Trillium Spot TPU
RUNTIME_VERSION="${GCP_TPU_VERSION:-v2-alpha-tpuv6e}" # Required runtime for v6e (NOT tpu-ubuntu2204-base)
LOCAL_EXP_DIR="${1:-./demos}"
LOCAL_OUT_DIR="${2:-./local_outputs}"

mkdir -p "${LOCAL_OUT_DIR}"

cleanup() {
  local exit_code=$?
  echo "[TRAP] Exit code ${exit_code} detected — syncing evolved artifacts before teardown..."
  gcloud compute tpus tpu-vm scp \
    "${TPU_NAME}:~/alphaevolve_workspace/outputs" \
    "${LOCAL_OUT_DIR}" \
    --project="${PROJECT_ID}" \
    --zone="${ZONE}" \
    --recurse \
    --quiet || true

  echo "[TRAP] Deleting Spot TPU VM '${TPU_NAME}' in ${ZONE} to stop billing..."
  gcloud compute tpus tpu-vm delete "${TPU_NAME}" \
    --project="${PROJECT_ID}" \
    --zone="${ZONE}" \
    --quiet || true

  echo "[VERIFY] Post-teardown TPU inventory in ${ZONE}:"
  gcloud compute tpus tpu-vm list \
    --project="${PROJECT_ID}" \
    --zone="${ZONE}" \
    --format="value(name)" \
    --limit=10
}
trap cleanup EXIT ERR INT TERM

echo "[1/4] Pre-flight check: verifying no orphaned TPU VMs exist in ${ZONE}..."
EXISTING="$(gcloud compute tpus tpu-vm list --project="${PROJECT_ID}" --zone="${ZONE}" --format="value(name)" --limit=10)"
if [[ -n "${EXISTING}" ]]; then
  echo "[ERROR] Found existing TPU VM(s) in ${ZONE}: ${EXISTING}. Inspect or delete before launching."
  exit 1
fi

echo "[2/4] Provisioning Spot Cloud TPU (${ACCEL_TYPE}, runtime ${RUNTIME_VERSION})..."
gcloud compute tpus tpu-vm create "${TPU_NAME}" \
  --project="${PROJECT_ID}" \
  --zone="${ZONE}" \
  --accelerator-type="${ACCEL_TYPE}" \
  --version="${RUNTIME_VERSION}" \
  --spot \
  --quiet

echo "[3/4] Syncing experiment workspace to ${TPU_NAME}..."
gcloud compute tpus tpu-vm ssh "${TPU_NAME}" \
  --project="${PROJECT_ID}" \
  --zone="${ZONE}" \
  --quiet \
  --command="mkdir -p ~/alphaevolve_workspace/outputs"

gcloud compute tpus tpu-vm scp \
  "${LOCAL_EXP_DIR}" \
  "${TPU_NAME}:~/alphaevolve_workspace/" \
  --project="${PROJECT_ID}" \
  --zone="${ZONE}" \
  --recurse \
  --quiet

echo "[4/4] Running AlphaEvolve JAX / TorchTPU evaluation loop on ${TPU_NAME}..."
gcloud compute tpus tpu-vm ssh "${TPU_NAME}" \
  --project="${PROJECT_ID}" \
  --zone="${ZONE}" \
  --quiet \
  --command="cd ~/alphaevolve_workspace && python3 demos/04_jax_torchtpu_evaluator_demo.py --output-dir ~/alphaevolve_workspace/outputs"

echo "[OK] Evolution run complete — trap will now copy outputs to ${LOCAL_OUT_DIR} and delete ${TPU_NAME}."
