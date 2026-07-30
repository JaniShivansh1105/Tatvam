type EventCallback = (payload: any) => void;

class WorkspaceEventBus {
  private listeners: Record<string, EventCallback[]> = {};

  subscribe(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event: string, payload?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }
}

export const workspaceEvents = new WorkspaceEventBus();

// Standard Events
export const EVENTS = {
  ConversationCompleted: 'ConversationCompleted',
  ArtifactCreated: 'ArtifactCreated',
  RecommendationGenerated: 'RecommendationGenerated',
  ConceptMasteryUpdated: 'ConceptMasteryUpdated',
  LearningDNAUpdated: 'LearningDNAUpdated',
  KnowledgeRetrieved: 'KnowledgeRetrieved',
  DocumentUploaded: 'DocumentUploaded',
  KnowledgeIndexed: 'KnowledgeIndexed',
  KnowledgeUpdated: 'KnowledgeUpdated',
  TriggerChat: 'TriggerChat',
};
