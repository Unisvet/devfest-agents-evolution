# Antigravity Zero-Leak Cloud TPU Lifecycle Rule

Whenever provisioning or running Google Cloud TPU workloads (such as AlphaEvolve `JAX` or `TorchTPU` evaluators), you MUST enforce an atomic, zero-leak lifecycle so no orphaned TPU VMs continue billing after completion or failure:

1. **Pre-Flight Orphan Check:**
   Before creating any TPU resource, verify no orphaned TPUs exist in the target project and zone (using explicit `--project`, `--zone`, and data-reduction flags):
   ```bash
   gcloud compute tpus tpu-vm list \
     --project="${GCP_PROJECT_ID}" \
     --zone="${GCP_TPU_ZONE:-europe-west4-a}" \
     --format="table(name,acceleratorType,state,schedulingConfig.spot)" \
     --limit=10
   ```
2. **Spot TPU Provisioning & Validated Runtime Pairings:**
   - Always pass `--spot` unless explicitly instructed otherwise to reduce Cloud TPU compute cost by ~60–70%.
   - Match `--accelerator-type` to its valid runtime `--version` and supported zone:
     - **Trillium (`v6e-1`, `v6e-4`, `v6e-8`):** `--version=v2-alpha-tpuv6e` in a Trillium zone (e.g., `europe-west4-a`, `us-east5-b`, `us-east1-d`). *(Never pass `tpu-ubuntu2204-base` to `v6e`—that runtime is only for `v4`/`v5`.)*
3. **Guaranteed `trap` Artifact Extraction & Teardown:**
   Execute remote AlphaEvolve runs inside a shell `trap cleanup EXIT ERR INT TERM` wrapper (`scripts/run_alphaevolve_spot_tpu.sh`) so that upon normal exit, script error, network drop, or `SIGINT`:
   - Evolved best programs (`best_program.py`, `outputs/`) and experiment summaries are synced back to `./local_outputs/` via `gcloud compute tpus tpu-vm scp ... --recurse || true`.
   - The TPU VM is unconditionally deleted via `gcloud compute tpus tpu-vm delete "${TPU_NAME}" --project="${GCP_PROJECT_ID}" --zone="${GCP_TPU_ZONE}" --quiet || true`.
4. **Post-Run Billing Verification Gate:**
   Run `gcloud compute tpus tpu-vm list --project="${GCP_PROJECT_ID}" --zone="${GCP_TPU_ZONE}" --format="value(name)"` one final time and confirm zero items remain before marking the task complete.
