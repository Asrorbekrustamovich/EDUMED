const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = 'edumed_super_secret_key_2026';

async function test() {
  try {
    // 1. Find a user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found in database');
      return;
    }
    console.log('Testing with user:', user.email, 'Current points:', user.points);

    // 2. Generate token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // 3. Make POST request to /api/volunteer/apply
    const res = await fetch('http://localhost:3000/api/volunteer/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ projectId: 'charity', pointsReward: 500 })
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Success! New points:', data.points);
      
      // Verify points in DB
      const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
      console.log('Database verified points:', updatedUser.points);
    } else {
      const text = await res.text();
      console.error('Failed response:', res.status, text);
    }
  } catch (err) {
    console.error('Test failed with error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
