import { 
  profiles, seniorConfigs, giftPools, contributors, mirrorSessions, users,
  type Profile, type InsertProfile,
  type SeniorConfig, type InsertSeniorConfig,
  type GiftPool, type InsertGiftPool,
  type Contributor, type InsertContributor,
  type MirrorSession, type InsertMirrorSession,
  type User, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createProfile(profile: InsertProfile): Promise<Profile>;
  getProfile(id: string): Promise<Profile | undefined>;
  
  createSeniorConfig(config: InsertSeniorConfig): Promise<SeniorConfig>;
  getSeniorConfigByProfileId(profileId: string): Promise<SeniorConfig | undefined>;
  
  createGiftPool(pool: InsertGiftPool): Promise<GiftPool>;
  getGiftPoolByMagicLink(code: string): Promise<GiftPool | undefined>;
  updateGiftPoolAmount(id: string, amount: number): Promise<GiftPool>;
  
  createContributor(contributor: InsertContributor): Promise<Contributor>;
  getContributorsByPoolId(poolId: string): Promise<Contributor[]>;
  
  createMirrorSession(session: InsertMirrorSession): Promise<MirrorSession>;
  getMirrorSessionByUuid(uuid: string): Promise<MirrorSession | undefined>;
  updateMirrorSessionTranscript(id: string, transcript: Array<{ role: string; text: string; timestamp: string }>): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [created] = await db.insert(profiles).values(profile).returning();
    return created;
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile || undefined;
  }

  async createSeniorConfig(config: InsertSeniorConfig): Promise<SeniorConfig> {
    const [created] = await db.insert(seniorConfigs).values(config).returning();
    return created;
  }

  async getSeniorConfigByProfileId(profileId: string): Promise<SeniorConfig | undefined> {
    const [config] = await db.select().from(seniorConfigs).where(eq(seniorConfigs.profileId, profileId));
    return config || undefined;
  }

  async createGiftPool(pool: InsertGiftPool): Promise<GiftPool> {
    const [created] = await db.insert(giftPools).values(pool).returning();
    return created;
  }

  async getGiftPoolByMagicLink(code: string): Promise<GiftPool | undefined> {
    const [pool] = await db.select().from(giftPools).where(eq(giftPools.magicLinkCode, code));
    return pool || undefined;
  }

  async updateGiftPoolAmount(id: string, amount: number): Promise<GiftPool> {
    const [updated] = await db
      .update(giftPools)
      .set({ currentRaised: amount })
      .where(eq(giftPools.id, id))
      .returning();
    return updated;
  }

  async createContributor(contributor: InsertContributor): Promise<Contributor> {
    const [created] = await db.insert(contributors).values(contributor).returning();
    return created;
  }

  async getContributorsByPoolId(poolId: string): Promise<Contributor[]> {
    return db.select().from(contributors).where(eq(contributors.poolId, poolId));
  }

  async createMirrorSession(session: InsertMirrorSession): Promise<MirrorSession> {
    const [created] = await db.insert(mirrorSessions).values(session).returning();
    return created;
  }

  async getMirrorSessionByUuid(uuid: string): Promise<MirrorSession | undefined> {
    const [session] = await db.select().from(mirrorSessions).where(eq(mirrorSessions.sessionUuid, uuid));
    return session || undefined;
  }

  async updateMirrorSessionTranscript(
    id: string, 
    transcript: Array<{ role: string; text: string; timestamp: string }>
  ): Promise<void> {
    await db
      .update(mirrorSessions)
      .set({ transcript, lastHeartbeat: new Date() })
      .where(eq(mirrorSessions.id, id));
  }
}

export const storage = new DatabaseStorage();
