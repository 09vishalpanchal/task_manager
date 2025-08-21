import {
  users,
  projects,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type UpdateProject,
  type ProjectWithUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getUserProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject, userId: string): Promise<Project>;
  updateProject(id: string, updates: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string, userId: string): Promise<boolean>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllProjects(): Promise<ProjectWithUser[]>;
  getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    monthlyProjects: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getUserProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject, userId: string): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values({ ...project, userId })
      .returning();
    return newProject;
  }

  async updateProject(id: string, updates: UpdateProject): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return result.rowCount > 0;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async getAllProjects(): Promise<ProjectWithUser[]> {
    return await db
      .select()
      .from(projects)
      .leftJoin(users, eq(projects.userId, users.id))
      .orderBy(desc(projects.createdAt))
      .then(rows => 
        rows.map(row => ({
          ...row.projects,
          user: row.users!
        }))
      );
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    monthlyProjects: number;
  }> {
    const [totalUsersResult] = await db.select({ count: count() }).from(users);
    const [activeUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isActive, true));
    
    const [totalProjectsResult] = await db.select({ count: count() }).from(projects);
    
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const [monthlyProjectsResult] = await db
      .select({ count: count() })
      .from(projects)
      .where(and(
        eq(projects.createdAt, currentMonth)
      ));

    return {
      totalUsers: totalUsersResult.count,
      activeUsers: activeUsersResult.count,
      totalProjects: totalProjectsResult.count,
      monthlyProjects: monthlyProjectsResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
