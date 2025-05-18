import { db, generateUlid } from './index';
import { students, subjects, groups, enrollments, subscriptions, payments } from './schema';
import { join } from 'path';
import pino from 'pino';

// Initialize logger
const logger = pino({ 
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination(join(process.cwd(), 'logs', 'seed.log')));

// Moroccan/Arabic/French first names
const firstNames = [
  'Mohammed', 'Ahmed', 'Youssef', 'Ali', 'Omar', 'Hamza', 'Amine', 'Hassan', 
  'Ibrahim', 'Khalid', 'Othmane', 'Rachid', 'Samir', 'Taha', 'Zakaria',
  'Fatima', 'Mariam', 'Aisha', 'Amina', 'Leila', 'Nora', 'Sara', 'Yasmine', 
  'Zineb', 'Salma', 'Hajar', 'Ines', 'Khadija', 'Layla', 'Malak',
  'Jean', 'Pierre', 'Michel', 'Sophie', 'Camille', 'Antoine', 'Marie', 'Nathalie',
  'Mehdi', 'Yassine', 'Karim', 'Anass', 'Bilal', 'Ilyas', 'Ismail', 'Jamal',
  'Aya', 'Hiba', 'Imane', 'Kawtar', 'Maryam', 'Najat', 'Samira', 'Souad'
];

// Moroccan/Arabic/French last names
const lastNames = [
  'El Amrani', 'Benkirane', 'Belhaj', 'Benjelloun', 'Bouazzaoui', 'Chaoui', 'Drissi',
  'El Fassi', 'El Idrissi', 'El Mansouri', 'El Moussaoui', 'El Ouazzani', 'Laroussi',
  'Lamrani', 'Lahlou', 'Mernissi', 'Mouline', 'Oudghiri', 'Sabri', 'Tazi',
  'Alaoui', 'Bennani', 'Berrada', 'Cherkaoui', 'El Hamdaoui', 'Filali', 'Haddaoui',
  'Kadiri', 'Khalil', 'Lahbabi', 'Mahmoudi', 'Naciri', 'Ouadghiri', 'Rami', 'Saidi',
  'Martin', 'Dupont', 'Dubois', 'Leroy', 'Moreau', 'Lambert', 'Lefebvre',
  'Ziani', 'Touimi', 'Soussi', 'Rhazi', 'Qabbaj', 'Ouazzani', 'Meknassi'
];

// Subject titles for an educational center
const subjectTitles = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History',
  'Geography', 'Philosophy', 'French Literature', 'Arabic Language',
  'English Language', 'Computer Science', 'Economics', 'Sports',
  'Art & Drawing', 'Music'
];

// Generate a random integer between min and max (inclusive)
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate a random date string in YYYY-MM-DD format
function getRandomDate(startDate: Date, endDate: Date): string {
  const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  return date.toISOString().split('T')[0];
}

// Generate a random month in YYYY-MM format within past year
function getRandomMonth(): string {
  const now = new Date();
  const pastYear = new Date(now);
  pastYear.setFullYear(now.getFullYear() - 1);
  
  const date = new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

// Generate random phone number
function getRandomPhone(): string {
  const prefixes = ['06', '07', '05'];
  const prefix = getRandomItem(prefixes);
  const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `${prefix}${number}`;
}

// Seed the database with sample data
async function seedDatabase() {
  try {
    logger.info('Starting database seed');
    
    // Clear existing data (if needed)
    // Uncomment to clear tables before seeding
    /*
    await db.delete(payments);
    await db.delete(subscriptions);
    await db.delete(enrollments);
    await db.delete(students);
    await db.delete(groups);
    await db.delete(subjects);
    */
    
    // 1. Create subjects (15 total)
    logger.info('Creating subjects');
    const createdSubjectIds: string[] = [];
    
    for (const title of subjectTitles) {
      const subjectId = generateUlid();
      createdSubjectIds.push(subjectId);
      
      await db.insert(subjects).values({
        id: subjectId,
        title,
        description: `Course on ${title} covering fundamentals and advanced topics`,
        metadata: JSON.stringify({
          level: getRandomItem(['Beginner', 'Intermediate', 'Advanced']),
          category: getRandomItem(['Science', 'Language', 'Humanities', 'Arts', 'Technical']),
          recommended: Math.random() > 0.7
        })
      });
    }
    
    // 2. Create groups (2-3 per subject)
    logger.info('Creating groups');
    const createdGroupIds: string[] = [];
    
    for (const subjectId of createdSubjectIds) {
      const groupCount = getRandomInt(2, 3);
      
      for (let i = 1; i <= groupCount; i++) {
        const groupId = generateUlid();
        createdGroupIds.push(groupId);
        
        const subjectTitle = await db.select({ title: subjects.title })
          .from(subjects)
          .where(({ id }) => id.eq(subjectId))
          .then(rows => rows[0]?.title || 'Unknown');
        
        const capacity = getRandomInt(10, 20);
        const startDate = getRandomDate(new Date('2023-01-01'), new Date('2023-09-01'));
        const endDate = getRandomDate(new Date('2023-12-01'), new Date('2024-06-30'));
        
        await db.insert(groups).values({
          id: groupId,
          subjectId,
          name: `${subjectTitle} Group ${i}`,
          capacity,
          startDate,
          endDate,
          schedule: JSON.stringify({
            days: ['Monday', 'Thursday'].sort(() => Math.random() - 0.5).slice(0, getRandomInt(1, 3)),
            time: getRandomItem(['9:00-10:30', '11:00-12:30', '14:00-15:30', '16:00-17:30'])
          })
        });
      }
    }
    
    // 3. Create 200 students
    logger.info('Creating 200 students');
    const createdStudentIds: string[] = [];
    
    for (let i = 0; i < 200; i++) {
      const studentId = generateUlid();
      createdStudentIds.push(studentId);
      
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const email = Math.random() > 0.3 ? `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s/g, '')}@example.com` : null;
      
      await db.insert(students).values({
        id: studentId,
        firstName,
        lastName,
        email,
        phone: Math.random() > 0.2 ? getRandomPhone() : null,
        address: Math.random() > 0.7 ? `${getRandomInt(1, 100)} Rue ${getRandomInt(1, 50)}, ${getRandomItem(['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir'])}` : null,
        status: getRandomItem(['active', 'inactive', 'pending']),
        isKicked: Math.random() < 0.05 // 5% of students are kicked
      });
    }
    
    // 4. Enroll students in groups (each student in 1-3 groups)
    logger.info('Creating enrollments');
    
    for (const studentId of createdStudentIds) {
      // Skip enrollment for kicked students
      const student = await db.select({ isKicked: students.isKicked })
        .from(students)
        .where(({ id }) => id.eq(studentId))
        .then(rows => rows[0]);
      
      if (student?.isKicked) continue;
      
      // Number of groups to enroll in
      const groupCount = getRandomInt(1, 3);
      const enrolledGroups = [];
      
      // Randomly select distinct groups
      while (enrolledGroups.length < groupCount && enrolledGroups.length < createdGroupIds.length) {
        const randomGroup = getRandomItem(createdGroupIds);
        if (!enrolledGroups.includes(randomGroup)) {
          enrolledGroups.push(randomGroup);
        }
      }
      
      // Create enrollments
      for (const groupId of enrolledGroups) {
        await db.insert(enrollments).values({
          id: generateUlid(),
          studentId,
          groupId,
          status: getRandomItem(['active', 'completed', 'dropped']),
          enrollmentDate: getRandomDate(new Date('2023-01-01'), new Date())
        });
      }
    }
    
    // 5. Create subscriptions
    logger.info('Creating subscriptions');
    
    for (const studentId of createdStudentIds) {
      // Get student's enrollments
      const studentEnrollments = await db.select({ groupId: enrollments.groupId })
        .from(enrollments)
        .where(({ studentId: id }) => id.eq(studentId));
      
      for (const enrollment of studentEnrollments) {
        // Get subject ID for the group
        const group = await db.select({ subjectId: groups.subjectId })
          .from(groups)
          .where(({ id }) => id.eq(enrollment.groupId))
          .then(rows => rows[0]);
        
        if (!group) continue;
        
        // Create 1-4 monthly subscriptions for each enrollment
        const subCount = getRandomInt(1, 4);
        
        for (let i = 0; i < subCount; i++) {
          const month = getRandomMonth();
          const amount = getRandomInt(300, 1200);
          
          await db.insert(subscriptions).values({
            id: generateUlid(),
            studentId,
            subjectId: group.subjectId,
            month,
            amount,
            tag: getRandomItem(['Regular', 'Discount', 'Promotion', null, null]),
            status: getRandomItem(['paid', 'pending', 'overdue'])
          });
        }
      }
    }
    
    // 6. Create payments
    logger.info('Creating payments');
    
    // Get all subscriptions with 'paid' status
    const paidSubscriptions = await db.select({
      studentId: subscriptions.studentId,
      subjectId: subscriptions.subjectId,
      amount: subscriptions.amount
    })
    .from(subscriptions)
    .where(({ status }) => status.eq('paid'));
    
    for (const subscription of paidSubscriptions) {
      // 80% chance of creating a payment for each paid subscription
      if (Math.random() < 0.8) {
        await db.insert(payments).values({
          id: generateUlid(),
          studentId: subscription.studentId,
          subjectId: subscription.subjectId,
          amount: Math.random() < 0.1 ? 
            subscription.amount - getRandomInt(50, 100) : // 10% chance of discount
            subscription.amount,
          date: getRandomDate(new Date('2023-01-01'), new Date()),
          overrideReason: Math.random() < 0.1 ? 'Family discount' : null
        });
      }
    }
    
    logger.info({ count: 200 }, 'Seeded demo students');
    logger.info('Database seed completed successfully');
    
    return {
      studentsCount: createdStudentIds.length,
      subjectsCount: createdSubjectIds.length,
      groupsCount: createdGroupIds.length
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to seed database');
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase().then((result) => {
    console.log('Database seed completed successfully');
    console.log(`Created ${result.studentsCount} students in ${result.groupsCount} groups across ${result.subjectsCount} subjects`);
    process.exit(0);
  }).catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
}

export { seedDatabase }; 