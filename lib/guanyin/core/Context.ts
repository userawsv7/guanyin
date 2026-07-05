export type InputTypeToken = "QUESTION" | "CODE_BLOCK" | "CONFIGURATION_MAP" | "TELEMETRY_LOG" | "CONVERSATION";
export type IntentVector = "LEARNING_KNOWLEDGE" | "FORENSIC_ANALYSIS" | "STANDARD_CONVERSATION";

export interface StructuralInput {
  readonly payloadValue: string;
  readonly matchedTypes: readonly InputTypeToken[];
}

export interface AbstractNode {
  readonly id: string;
  readonly entityLabel: string;
  readonly stateProfile: "ANOMALOUS" | "STABLE" | "CONCEPTUAL";
}

export interface AbstractEdge {
  readonly sourceId: string;
  readonly targetId: string;
  readonly relationshipLabel: string;
}

export interface UniversalContext {
  readonly eventTokenId: string;
  readonly normalizedInput: StructuralInput;
  readonly detectedIntent: IntentVector;
  readonly metadata: {
    readonly requestTimestamp: number;
    readonly evaluationProcessingRoute: string;
  };
  readonly observations: readonly {
    readonly id: string;
    readonly literalContent: string;
    readonly derivedWeight: "HIGH" | "MEDIUM" | "LOW";
  }[];
  readonly relationships: {
    readonly coreTopologyNodes: readonly AbstractNode[];
    readonly coreTopologyEdges: readonly AbstractEdge[];
  };
  readonly retrievedKnowledge: readonly {
    readonly domainConcept: string;
    readonly mechanicsSummary: string;
  }[];
  readonly hypotheses: readonly {
    readonly targetMechanism: string;
    readonly contradictionsIdentified: string[];
    readonly isolatedConfidence: "HIGH" | "MEDIUM" | "LOW";
  }[];
  readonly risksAndActions: {
    readonly evaluationVerdict: "ALLOW" | "REQUIRES_CONFIRMATION" | "BLOCK";
    readonly safeSteps: string[];
    readonly fallbackRollbackVectors: string[];
  };
  readonly finalOutputManifest: {
    readonly conversationalGreeting: string;
    readonly structuralSummary: string;
    readonly verificationSteps: string[];
  };
  readonly pipelineAuditLog: readonly string[];
}

export interface UniversalPipelineLayer {
  readonly layerName: string;
  execute(context: UniversalContext): UniversalContext;
}
