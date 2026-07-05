"use client";

import { useState } from "react";
import { UniversalContext } from "@/lib/guanyin/core/Context";

export default function Home() {
  const [dataPayload, setDataPayload] = useState("");
  const [context, setContext] = useState<UniversalContext | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearAndPopulate = (text: string) => {
    setDataPayload(text);
  };

  const executePipeline = async () => {
    if (!dataPayload.trim()) return;
    setLoading(true);
    setErrorMessage(null);
    setContext(null);
    try {
      const response = await fetch("/api/reason", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: dataPayload })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setErrorMessage(data.error || "An unexpected system exception occurred.");
      } else {
        setContext(data);
      }
    } catch (err) {
      setErrorMessage("Failed to establish communication with the serverless backend pipeline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '40px', maxWidth: '1300px', margin: '0 auto', boxSizing: 'border-box' }}>
      <header style={{ borderBottom: '1px solid #30363d', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#58a6ff', margin: '0 0 5px 0', fontSize: '1.8rem' }}>🕉 GUANYIN (观音)</h1>
        <p style={{ color: '#8b949e', margin: 0, fontSize: '0.95rem' }}>General Technical Reasoning Engine — Unified Decoupled Knowledge & Forensic Fabric</p>
      </header>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => clearAndPopulate("Hey Guanyin, let's look into our infrastructure layout profiles today.")} style={{ padding: '8px 14px', backgroundColor: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Scenario: Normal Chat</button>
        <button onClick={() => clearAndPopulate("Explain how the B-Tree indexing mechanism optimizes throughput inside a database system layer.")} style={{ padding: '8px 14px', backgroundColor: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Scenario: Knowledge / Design Why</button>
        <button onClick={() => clearAndPopulate("CRITICAL SYSTEM FATAL ANOMALY: Connection pool timeout reached on persistence bounds cluster.\nERROR 503 Gateway Timeout\nMax pool connections matching specification limit = 100 exhausted.")} style={{ padding: '8px 14px', backgroundColor: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Scenario: Forensic Outage Plan</button>
      </div>

      <div style={{ marginBottom: '35px' }}>
        <textarea
          value={dataPayload}
          onChange={(e) => setDataPayload(e.target.value)}
          placeholder="Type general queries, explain architectural gaps, paste code elements, or dump infrastructure configurations..."
          style={{ width: '100%', height: '150px', padding: '16px', backgroundColor: '#161b22', color: '#f0f6fc', border: '1px solid #30363d', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', lineHeight: '1.5' }}
        />
        <button
          onClick={executePipeline}
          disabled={loading}
          style={{ marginTop: '14px', padding: '14px 35px', backgroundColor: '#238636', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' }}
        >
          {loading ? "EVALUATING PIPELINE CONSTRAINTS CRITERIA..." : "ENGAGE UNIFIED REASONING SYSTEM"}
        </button>
      </div>

      {errorMessage && (
        <div style={{ padding: '20px', backgroundColor: '#2d1f1f', borderRadius: '6px', border: '1px solid #f85149', color: '#ff7b72', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>🚨 Pipeline Execution Error</h3>
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </div>
      )}

      {context && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '6px', border: '1px solid #30363d' }}>
            <h3 style={{ color: '#58a6ff', marginTop: 0, borderBottom: '1px solid #21262d', paddingBottom: '8px' }}>⚡ METADATA ROUTER RUNTIME SUMMARY</h3>
            <p style={{ margin: '6px 0' }}><strong>Unique Core Event Token:</strong> <code>{context.eventTokenId}</code></p>
            <p style={{ margin: '6px 0' }}><strong>Inferred Pipeline Stream Intent:</strong> <span style={{ color: '#ffa657', fontWeight: 'bold' }}>{context.detectedIntent}</span></p>
            <p style={{ margin: '6px 0' }}><strong>Mapped Input Typologies Detected:</strong> {context.normalizedInput?.matchedTypes?.join(', ') || 'None'}</p>
            <div style={{ marginTop: '15px', fontSize: '14px', backgroundColor: '#0d1117', padding: '14px', borderRadius: '6px', borderLeft: '4px solid #58a6ff', lineHeight: '1.6' }}>
              <strong style={{ color: '#58a6ff' }}>{context.finalOutputManifest?.conversationalGreeting}</strong>
              <p style={{ margin: '6px 0 0 0', color: '#e6edf3' }}>{context.finalOutputManifest?.structuralSummary}</p>
            </div>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '6px', border: '1px solid #30363d' }}>
            <h3 style={{ color: '#79c0ff', marginTop: 0, borderBottom: '1px solid #21262d', paddingBottom: '8px' }}>📋 PURE OBSERVATION MANIFEST EVIDENCE LIST</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #30363d', color: '#8b949e', fontSize: '12px' }}>
                  <th style={{ padding: '8px' }}>TOKEN ID</th>
                  <th style={{ padding: '8px' }}>PRIORITY WEIGHT</th>
                  <th style={{ padding: '8px' }}>EXTRACTED SYSTEM FACT STRING</th>
                </tr>
              </thead>
              <tbody>
                {context.observations?.map((obs) => (
                  <tr key={obs.id} style={{ borderBottom: '1px solid #21262d', fontSize: '13px' }}>
                    <td style={{ padding: '8px', color: '#ff7b72' }}>{obs.id}</td>
                    <td style={{ padding: '8px', color: obs.derivedWeight === 'HIGH' ? '#ff7b72' : '#8b949e' }}>{obs.derivedWeight}</td>
                    <td style={{ padding: '8px' }}><code>{obs.literalContent}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {context.retrievedKnowledge && context.retrievedKnowledge.length > 0 && (
            <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '6px', border: '1px solid #30363d' }}>
              <h3 style={{ color: '#ffa657', marginTop: 0, borderBottom: '1px solid #21262d', paddingBottom: '8px' }}>📚 DYNAMIC SUB-CAPABILITY KNOWLEDGE MAPS</h3>
              {context.retrievedKnowledge.map((k, idx) => (
                <div key={idx} style={{ margin: '10px 0', paddingLeft: '12px', borderLeft: '3px solid #ffa657' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#ffa657' }}>Concept: {k.domainConcept}</p>
                  <p style={{ margin: '4px 0 0 0', color: '#c9d1d9', fontSize: '13px' }}>Mechanics Law: {k.mechanicsSummary}</p>
                </div>
              ))}
            </div>
          )}

          {context.detectedIntent === "FORENSIC_ANALYSIS" && context.hypotheses && context.hypotheses.length > 0 && (
            <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '6px', border: '1px solid #30363d' }}>
              <h3 style={{ color: '#ff7b72', marginTop: 0, borderBottom: '1px solid #21262d', paddingBottom: '8px' }}>🔬 DEDUCTED FORENSIC MECHANICAL HYPOTHESIS</h3>
              {context.hypotheses.map((h, idx) => (
                <div key={idx} style={{ paddingLeft: '12px', borderLeft: '3px solid #ff7b72' }}>
                  <p style={{ margin: 0 }}><strong>Calculated Target Mechanism:</strong> {h.targetMechanism}</p>
                  <p style={{ margin: '6px 0 0 0', color: '#ff7b72', fontWeight: 'bold' }}>Evaluated Confidence Weight: [{h.isolatedConfidence}]</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '6px', border: '1px solid #30363d' }}>
            <h3 style={{ color: '#bc8cff', marginTop: 0, borderBottom: '1px solid #21262d', paddingBottom: '8px' }}>🌐 DATA-DRIVEN ABSTRACT MODEL SCHEMA LAYER</h3>
            <div style={{ padding: '16px', backgroundColor: '#0d1117', borderRadius: '6px', border: '1px solid #21262d' }}>
              <p style={{ color: '#8b949e', margin: '0 0 10px 0', fontSize: '12px' }}>Discovered Graph Base Vertices:</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                {context.relationships?.coreTopologyNodes?.map(n => (
                  <span key={n.id} style={{ padding: '4px 10px', backgroundColor: '#161b22', border: `1px solid ${n.stateProfile === 'ANOMALOUS' ? '#f85149' : '#30363d'}`, borderRadius: '4px', fontSize: '12px' }}>
                    [{n.id}] {n.entityLabel} <strong style={{ color: '#bc8cff' }}>({n.stateProfile})</strong>
                  </span>
                ))}
              </div>
              {context.relationships?.coreTopologyEdges && context.relationships.coreTopologyEdges.length > 0 && <p style={{ color: '#8b949e', margin: '0 0 5px 0', fontSize: '12px' }}>Structural Primitive Edges:</p>}
              {context.relationships?.coreTopologyEdges?.map((e, idx) => (
                <div key={idx} style={{ color: '#79c0ff', fontSize: '13px' }}><code>{e.sourceId} ───( {e.relationshipLabel} )───► {e.targetId}</code></div>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '6px', border: '1px solid #30363d' }}>
            <h3 style={{ color: '#56d364', marginTop: 0, borderBottom: '1px solid #21262d', paddingBottom: '8px' }}>🛡️ COMPLIANCE CONTROLS & COMPACT SAFETY PLANS</h3>
            <div style={{ padding: '12px', backgroundColor: context.risksAndActions?.evaluationVerdict === 'ALLOW' ? '#1b2a1c' : '#2d1f1f', borderRadius: '4px', border: `1px solid ${context.risksAndActions?.evaluationVerdict === 'ALLOW' ? '#238636' : '#f85149'}`, marginBottom: '15px' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>EXECUTION VERDICT DIRECTION: {context.risksAndActions?.evaluationVerdict}</p>
            </div>
            {context.risksAndActions?.safeSteps && context.risksAndActions.safeSteps.length > 0 && (
              <>
                <h4 style={{ color: '#8b949e', margin: '10px 0 6px 0', fontSize: '13px' }}>Remediation Action Traversal Steps:</h4>
                <ol style={{ paddingLeft: '20px', margin: 0 }}>{context.risksAndActions.safeSteps.map((s, i) => <li key={i} style={{ margin: '4px 0', fontSize: '13px' }}>{s}</li>)}</ol>
              </>
            )}
            {context.risksAndActions?.fallbackRollbackVectors && context.risksAndActions.fallbackRollbackVectors.length > 0 && (
              <>
                <h4 style={{ color: '#ff7b72', margin: '14px 0 6px 0', fontSize: '13px' }}>Mandatory Safe Fallback/Rollback Trackers:</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>{context.risksAndActions.fallbackRollbackVectors.map((r, i) => <li key={i} style={{ margin: '4px 0', fontSize: '13px', color: '#ff7b72' }}>{r}</li>)}</ul>
              </>
            )}
            <h4 style={{ color: '#79c0ff', margin: '14px 0 6px 0', fontSize: '13px' }}>Post-Remediation Verification Manifest:</h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>{context.finalOutputManifest?.verificationSteps?.map((v, i) => <li key={i} style={{ margin: '4px 0', fontSize: '13px' }}>{v}</li>)}</ul>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '6px', border: '1px solid #30363d' }}>
            <h3 style={{ color: '#8b949e', marginTop: 0, borderBottom: '1px solid #21262d', paddingBottom: '8px' }}>🪵 DECOUPLED IMMUTABLE PIPELINE AUDIT COMPREHENSION TRACE LOGS</h3>
            {context.pipelineAuditLog?.map((log, idx) => (
              <div key={idx} style={{ padding: '6px 0', borderBottom: '1px solid #21262d', fontSize: '12px', color: '#8b949e' }}>
                <code>{log}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
