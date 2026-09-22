import { defineContract } from "@prisma/orm-postgres/contract-builder";

export const contract = defineContract({}, ({ field, model, rel }) => {
  const User = model(`User`, {
    fields: {
      id: field.id.uuidv7String(),
      email: field.text().unique(),
      name: field.text().optional(),
      username: field.text().optional(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
  const Workspace = model(`Workspace`, {
    fields: {
      id: field.id.uuidv7String(),
      name: field.text(),
      slug: field.text().unique(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
  const WorkspaceMember = model(`WorkspaceMember`, {
    fields: {
      id: field.id.uuidv7String(),
      userId: field.uuidString(),
      workspaceId: field.uuidString(),
      role: field.text(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  }).sql(({ cols, constraints }) => ({
    indexes: [
      constraints.index([cols.userId, cols.workspaceId], { unique: true }),
    ],
  }));
  const Document = model(`Document`, {
    fields: {
      id: field.id.uuidv7String(),
      workspaceId: field.uuidString(),
      title: field.text(),
      content: field.text().optional(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
  const Conversation = model(`Conversation`, {
    fields: {
      id: field.id.uuidv7String(),
      workspaceId: field.uuidString(),
      title: field.text().optional(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
  const Message = model(`Message`, {
    fields: {
      id: field.id.uuidv7String(),
      content: field.text(),
      role: field.text(),
      conversationId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
  return {
    models: {
      User: User.relations({
        workspaceMembers: rel.hasMany(WorkspaceMember, {
          by: `userId`,
        }),
      }),
      Workspace: Workspace.relations({
        members: rel.hasMany(WorkspaceMember, {
          by: `workspaceId`,
        }),
        conversations: rel.hasMany(Conversation, {
          by: `workspaceId`,
        }),
        documents: rel.hasMany(Document, {
          by: `workspaceId`,
        }),
      }),
      WorkspaceMember: WorkspaceMember.relations({
        user: rel.belongsTo(User, {
          from: `userId`,
          to: `id`,
        }),
        workspace: rel.belongsTo(Workspace, {
          from: `workspaceId`,
          to: `id`,
        }),
      }),
      Document: Document.relations({
        workspace: rel.belongsTo(Workspace, {
          from: `workspaceId`,
          to: `id`,
        }),
      }),
      Conversation: Conversation.relations({
        workspace: rel.belongsTo(Workspace, {
          from: `workspaceId`,
          to: `id`,
        }),
        messages: rel.hasMany(Message, {
          by: `conversationId`,
        }),
      }),
      Message: Message.relations({
        conversation: rel.belongsTo(Conversation, {
          from: `conversationId`,
          to: `id`,
        }),
      }),
    },
  };
});
