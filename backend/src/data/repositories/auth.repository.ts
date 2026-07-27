import { prisma } from "../prisma.js";
import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { Prisma } from "@prisma/client";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: any = require("../../data/prisma.js").prisma) {}
  // ─── Users ─────────────────────────────────────────────────────────────
  async findUserByEmailOrUsername(email: string, username?: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email }, ...(username ? [{ username }] : [])],
      },
      select: { email: true, username: true },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        emailVerified: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true,
        hashedPassword: true,
        profile: true,
        preference: {
          include: { language: true },
        },
        learningDNA: true,
      },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        emailVerified: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        preference: {
          include: { language: true },
        },
        learningDNA: true,
      },
    });
  }

  async createUserWithRelations(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        emailVerified: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        preference: true,
      },
    });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: { hashedPassword },
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // ─── Profiles & Preferences ────────────────────────────────────────────
  async upsertProfile(userId: string, createData: Prisma.ProfileUncheckedCreateInput, updateData: Prisma.ProfileUncheckedUpdateInput) {
    return this.prisma.profile.upsert({
      where: { userId },
      create: createData,
      update: updateData,
    });
  }

  async upsertPreference(userId: string, createData: Prisma.UserPreferenceUncheckedCreateInput, updateData: Prisma.UserPreferenceUncheckedUpdateInput) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      create: createData,
      update: updateData,
      include: { language: true },
    });
  }

  // ─── Languages ─────────────────────────────────────────────────────────
  async findLanguageByName(name: string) {
    return this.prisma.language.findFirst({ where: { name } });
  }

  async findDefaultLanguage() {
    return this.prisma.language.findFirst({ where: { active: true } });
  }

  async createLanguage(data: Prisma.LanguageUncheckedCreateInput) {
    return this.prisma.language.create({ data });
  }

  // ─── Sessions ──────────────────────────────────────────────────────────
  async createSession(data: Prisma.SessionUncheckedCreateInput) {
    return this.prisma.session.create({ data });
  }

  async findActiveSessions(userId: string) {
    return this.prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true, hashedRefreshToken: true, userAgent: true, ipAddress: true },
    });
  }

  async findNonRevokedSessions(userId: string) {
    return this.prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
      },
      select: { id: true, hashedRefreshToken: true },
    });
  }

  async updateSession(id: string, data: Prisma.SessionUncheckedUpdateInput) {
    return this.prisma.session.update({
      where: { id },
      data,
    });
  }

  async revokeAllUserSessions(userId: string) {
    return this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
