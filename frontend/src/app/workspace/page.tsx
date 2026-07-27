"use client";

import React from 'react';
import { Sidebar } from '../../components/workspace/Sidebar';
import { ConversationPanel } from '../../components/workspace/ConversationPanel';
import { ContextPanel } from '../../components/workspace/ContextPanel';

export default function WorkspacePage() {
  return (
    <>
      <Sidebar />
      <ConversationPanel />
      <ContextPanel />
    </>
  );
}
