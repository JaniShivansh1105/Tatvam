export interface IArtifactRepository {
  createArtifact(data: any): Promise<any>;
  getArtifactById(id: string): Promise<any>;
  getUserArtifacts(userId: string, type?: string): Promise<any[]>;
  updateArtifact(id: string, data: any): Promise<any>;
  deleteArtifact(id: string): Promise<void>;
}
