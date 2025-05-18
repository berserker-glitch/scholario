import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Students table - contains personal information
 */
export const students = sqliteTable('students', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  parentPhone: text('parent_phone'),
  parentType: text('parent_type'),
  school: text('school'),
  studyYear: text('study_year'),
  sex: text('sex'),
  tag: text('tag'),
  customFee: integer('custom_fee'),
  cni: text('cni'),
  isKicked: integer('is_kicked', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  nameIdx: index('students_name_idx').on(table.firstName, table.lastName),
  kickedIdx: index('students_kicked_idx').on(table.isKicked)
}));

/**
 * Subjects table - contains course information
 */
export const subjects = sqliteTable('subjects', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  title: text('title').notNull(),
  description: text('description'),
  fee: integer('fee'),
  metadata: text('metadata'), // JSON string for additional metadata
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  titleIdx: index('subjects_title_idx').on(table.title)
}));

/**
 * Groups table - contains course groups with capacity and schedule
 */
export const groups = sqliteTable('groups', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  subjectId: text('subject_id').notNull().references(() => subjects.id),
  name: text('name').notNull(),
  capacity: integer('capacity').notNull().default(10),
  schedule: text('schedule'), // JSON string for schedule
  startDate: text('start_date'),
  endDate: text('end_date'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  subjectIdIdx: index('groups_subject_id_idx').on(table.subjectId),
  nameIdx: index('groups_name_idx').on(table.name)
}));

/**
 * Enrollments table - junction table between students and groups
 */
export const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  studentId: text('student_id').notNull().references(() => students.id),
  groupId: text('group_id').notNull().references(() => groups.id),
  enrollmentDate: text('enrollment_date').default(sql`CURRENT_TIMESTAMP`),
  status: text('status').notNull().default('active'),
  notes: text('notes'),
}, (table) => ({
  studentIdIdx: index('enrollments_student_id_idx').on(table.studentId),
  groupIdIdx: index('enrollments_group_id_idx').on(table.groupId),
  studentGroupIdx: index('enrollments_student_group_idx').on(table.studentId, table.groupId),
  statusIdx: index('enrollments_status_idx').on(table.status)
}));

/**
 * Subscriptions table - contains student subscriptions to subjects
 */
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  studentId: text('student_id').notNull().references(() => students.id),
  subjectId: text('subject_id').notNull().references(() => subjects.id),
  month: text('month').notNull(), // Format: YYYY-MM
  tag: text('tag'),
  amount: integer('amount').notNull(),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  studentIdIdx: index('subscriptions_student_id_idx').on(table.studentId),
  subjectIdIdx: index('subscriptions_subject_id_idx').on(table.subjectId),
  monthIdx: index('subscriptions_month_idx').on(table.month),
  statusIdx: index('subscriptions_status_idx').on(table.status)
}));

/**
 * Payments table - contains student payments for subjects
 */
export const payments = sqliteTable('payments', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  studentId: text('student_id').notNull().references(() => students.id),
  subjectId: text('subject_id').notNull().references(() => subjects.id),
  amount: integer('amount').notNull(),
  date: text('date').notNull().default(sql`CURRENT_DATE`),
  overrideReason: text('override_reason'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  studentIdIdx: index('payments_student_id_idx').on(table.studentId),
  subjectIdIdx: index('payments_subject_id_idx').on(table.subjectId),
  dateIdx: index('payments_date_idx').on(table.date)
}));

/**
 * Settings table - contains application settings
 */
export const settings = sqliteTable('settings', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  keyIdx: index('settings_key_idx').on(table.key)
}));

/**
 * Backups table - contains backup metadata
 */
export const backups = sqliteTable('backups', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  path: text('path').notNull(),
  size: integer('size').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  notes: text('notes'),
});

/**
 * Audit logs table - optional for tracking application events
 */
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  changes: text('changes'), // JSON string of changes
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  actionIdx: index('audit_logs_action_idx').on(table.action),
  entityTypeIdx: index('audit_logs_entity_type_idx').on(table.entityType),
  entityIdIdx: index('audit_logs_entity_id_idx').on(table.entityId)
}));

/**
 * Users table - contains authentication information
 */
export const users = sqliteTable('users', {
  id: text('id').primaryKey().notNull(), // ULID as primary key
  accessCode: text('access_code').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}); 