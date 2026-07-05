import { UniversalPipelineLayer, UniversalContext, InputTypeToken, IntentVector } from '../core/Context';

export class InputNormalizationAndIntentLayer implements UniversalPipelineLayer {
  readonly layerName = "Input Normalization & Intent Detection Layer";
  execute(context: UniversalContext): UniversalContext {
    const rawText = context.normalizedInput.payloadValue;
    const cleanLower = rawText.toLowerCase();
    
    const types: InputTypeToken[] = [];
    let inferredIntent: IntentVector = "LEARNING_KNOWLEDGE";

    if (/error|fail|exception|crash|panic|status_[45]\d\d/i.test(cleanLower)) types.push("TELEMETRY_LOG");
    if (/[{}[\]();=]/i.test(cleanLower) && (cleanLower.includes('function') || cleanLower.includes('import') || cleanLower.includes('const'))) types.push("CODE_BLOCK");
    if (cleanLower.includes('yaml') || cleanLower.includes('apiVersion') || cleanLower.includes('provider "') || cleanLower.includes('image:')) types.push("CONFIGURATION_MAP");
    if (/what is|explain|teach me|how does|compare/i.test(cleanLower)) types.push("QUESTION");
    if (types.length === 0 && cleanLower.length < 50) types.push("CONVERSATION");
    if (types.length === 0) types.push("QUESTION");

    if (types.includes("TELEMETRY_LOG") || cleanLower.includes("why is it failing") || cleanLower.includes("broken")) {
      inferredIntent = "FORENSIC_ANALYSIS";
    } else if (types.includes("CONVERSATION") && !cleanLower.includes("help")) {
      inferredIntent = "STANDARD_CONVERSATION";
    }

    const logs = [...context.pipelineAuditLog, `[${this.layerName}]: Structural Types identified: [${types.join(', ')}]. Routing Vector marked as: ${inferredIntent}.`];

    return {
      ...context,
      detectedIntent: inferredIntent,
      normalizedInput: { payloadValue: rawText, matchedTypes: types },
      pipelineAuditLog: logs
    };
  }
}

export class EvidenceAndObservationLayer implements UniversalPipelineLayer {
  readonly layerName = "Evidence Extraction & Observation Layer";
  execute(context: UniversalContext): UniversalContext {
    const lines = context.normalizedInput.payloadValue.split('\n').map(l => l.trim()).filter(Boolean);
    const discoveredObs: any[] = [];

    lines.forEach((line, idx) => {
      if (/error|fail|exception/i.test(line)) {
        discoveredObs.push({ id: `OBS-${idx}`, literalContent: line, derivedWeight: "HIGH" });
      } else if (line.length > 5) {
        discoveredObs.push({ id: `OBS-${idx}`, literalContent: line, derivedWeight: "LOW" });
      }
    });

    const logs = [...context.pipelineAuditLog, `[${this.layerName}]: Populated ${discoveredObs.length} distinct context data observations.`];
    return {
      ...context,
      observations: discoveredObs,
      pipelineAuditLog: logs
    };
  }
}

export class AbstractGraphBuilderLayer implements UniversalPipelineLayer {
  readonly layerName = "Abstract Graph Topology Vector Builder Layer";
  execute(context: UniversalContext): UniversalContext {
    const isAnalysis = context.detectedIntent === "FORENSIC_ANALYSIS";
    const isConv = context.detectedIntent === "STANDARD_CONVERSATION";

    let nodes: any[] = [];
    let edges: any[] = [];

    if (isConv) {
      nodes = [{ id: "A1", entityLabel: "Interface Workspace Proxy", stateProfile: "CONCEPTUAL" }];
    } else if (isAnalysis) {
      nodes = [
        { id: "N1", entityLabel: "System Routing Ingress Engine", stateProfile: "STABLE" },
        { id: "N2", entityLabel: "Processing Core Runtime Boundary", stateProfile: "ANOMALOUS" }
      ];
      edges = [{ sourceId: "N1", targetId: "N2", relationshipLabel: "Forwards Faulty Context Payload" }];
    } else {
      nodes = [
        { id: "K1", entityLabel: "System Foundation Architecture Primitives", stateProfile: "CONCEPTUAL" },
        { id: "K2", entityLabel: "Dynamic Subsystem Component Matrix", stateProfile: "CONCEPTUAL" }
      ];
      edges = [{ sourceId: "K1", targetId: "K2", relationshipLabel: "Extends Declarative Properties Matrix Toward" }];
    }

    const logs = [...context.pipelineAuditLog, `[${this.layerName}]: Mapped clean framework definitions into data-driven graph structural types.`];
    return {
      ...context,
      relationships: { coreTopologyNodes: nodes, coreTopologyEdges: edges },
      pipelineAuditLog: logs
    };
  }
}
