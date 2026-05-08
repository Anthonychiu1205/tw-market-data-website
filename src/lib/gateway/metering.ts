import "server-only";

import type { DatasetPolicy } from "@/src/lib/gateway/policies";

export type DryRunMeteringResult = {
  creditsCost: number;
  dryRun: true;
};

export function resolveDryRunMetering(datasetPolicy: DatasetPolicy): DryRunMeteringResult {
  return {
    creditsCost: datasetPolicy.creditsCost,
    dryRun: true,
  };
}

