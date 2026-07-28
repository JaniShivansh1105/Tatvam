import { redirect } from 'next/navigation';

export default function WorkspaceKnowledgePage() {
  redirect('/dashboard/mentor?tab=knowledge');
}
