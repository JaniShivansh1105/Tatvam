import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import fs from 'fs';

async function run() {
  try {
    const p = new PrismaClient();
    const u = await p.user.findFirst();
    const token = jwt.sign({ userId: u.id }, 'secret', { expiresIn: '1y' });
    const res = await fetch('http://localhost:4000/api/knowledge/context', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    fs.writeFileSync('api_test.log', JSON.stringify(data, null, 2));
    console.log('SUCCESS');
  } catch (e) {
    fs.writeFileSync('api_test.log', e.message);
    console.log('FAILED');
  }
}
run();
