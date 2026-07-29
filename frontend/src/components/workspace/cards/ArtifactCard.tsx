import React, { useState } from 'react';
import { FileText, Download, Share2, MessageSquare, Trash2, Edit3 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useConversationStore } from '../../../store/conversation.store';
import { apiClient } from '../../../lib/api-client';
import { toast } from 'react-hot-toast';
import { workspaceEvents, EVENTS } from '../../../lib/workspace-events';

export const ArtifactCard = ({ artifact }: { artifact: any }) => {
  const { setSessionId, clearMessages, addMessage } = useConversationStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = () => {
    const type = artifact.artifactType || artifact.type || 'Document';
    const filename = `${artifact.title.replace(/\s+/g, '_')}_${Date.now()}`;
    
    // Choose format based on type
    if (type === 'Notes' || type === 'Bookmarks') {
      downloadFile(artifact.content, `${filename}.md`, 'text/markdown');
    } else if (type === 'Quizzes' || type === 'Flashcards') {
      downloadFile(artifact.content, `${filename}.json`, 'application/json');
    } else {
      // Default to PDF for others like Practice Set, Revision Sheet
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(artifact.title, 10, 10);
      doc.setFontSize(12);
      
      const splitText = doc.splitTextToSize(artifact.content || "", 180);
      doc.text(splitText, 10, 20);
      doc.save(`${filename}.pdf`);
    }
    toast.success('Download started');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this artifact?')) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/workspace/artifacts/${artifact.id}`);
      workspaceEvents.emit(EVENTS.ArtifactCreated, null);
      toast.success('Artifact deleted');
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRename = async () => {
    const newTitle = prompt('Enter new title for artifact:', artifact.title);
    if (!newTitle || !newTitle.trim()) return;
    try {
      await apiClient.patch(`/workspace/artifacts/${artifact.id}`, { title: newTitle.trim() });
      workspaceEvents.emit(EVENTS.ArtifactCreated, null);
    } catch (err) {
      toast.error('Failed to rename');
    }
  };

  const handleOpenConversation = async () => {
    if (!artifact.sourceConversationId) {
      toast.error("No linked conversation found");
      return;
    }
    try {
      const res = await apiClient.get('/ai/mentor/history');
      const session = res.data.data.find((s: any) => s.id === artifact.sourceConversationId);
      if (session) {
        clearMessages();
        setSessionId(session.id);
        session.messages.forEach((m: any) => {
          addMessage({ id: m.id, role: m.role as any, content: m.content });
        });
      }
    } catch (err) {
      toast.error("Failed to load conversation");
    }
  };

  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden group hover:border-[#6C5CE7]/30 transition-all hover:shadow-md ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8F9FF] flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0E6FF] flex items-center justify-center shrink-0 text-[#6C5CE7] border border-[#6C5CE7]/20 mt-0.5">
            <FileText size={16} />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-[#1B1D35]">{artifact.title}</h4>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-[10px] text-[#A0AEC0] uppercase font-bold tracking-wider">{artifact.artifactType || artifact.type}</p>
               <span className="text-[10px] text-[#E2E8F0]">•</span>
               <p className="text-[10px] text-[#A0AEC0]">{new Date(artifact.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {artifact.sourceConversationId && (
            <button onClick={handleOpenConversation} title="Open Conversation" className="p-1.5 text-[#A0AEC0] hover:text-[#6C5CE7] rounded-md hover:bg-[#F0E6FF] transition-colors">
              <MessageSquare size={14} />
            </button>
          )}
          <button onClick={handleDownload} title="Download" className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] rounded-md hover:bg-white border border-transparent hover:border-[#E2E8F0] hover:shadow-sm">
            <Download size={14} />
          </button>
          <button onClick={handleRename} title="Rename" className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] rounded-md hover:bg-white border border-transparent hover:border-[#E2E8F0] hover:shadow-sm">
            <Edit3 size={14} />
          </button>
          <button onClick={handleDelete} title="Delete" className="p-1.5 text-[#A0AEC0] hover:text-red-500 rounded-md hover:bg-red-50 border border-transparent hover:border-red-100 hover:shadow-sm">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-xs font-medium text-[#718096] line-clamp-2">
          {artifact.description || "Generated from your latest learning session."}
        </p>
        {artifact.chatSession?.title && (
          <p className="text-[11px] text-[#A0AEC0] flex items-center gap-1">
            Source: <span className="font-medium text-[#4A5568]">{artifact.chatSession.title}</span>
          </p>
        )}
      </div>
    </div>
  );
};
