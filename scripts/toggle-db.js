const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target = process.argv[2]; // 'postgres' or 'sqlite'

if (target !== 'postgres' && target !== 'sqlite') {
  console.error('Usage: node scripts/toggle-db.js [postgres|sqlite]');
  process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(schemaPath)) {
  console.error('schema.prisma not found at:', schemaPath);
  process.exit(1);
}

let schema = fs.readFileSync(schemaPath, 'utf8');

if (target === 'sqlite') {
  console.log('Switching database provider to SQLite...');
  
  // Replace provider in schema
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, schema, 'utf8');

  // Update .env file
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    // Remove existing DATABASE_URL line
    envContent = envContent.replace(/^DATABASE_URL=.*$/m, '');
  }
  envContent = `DATABASE_URL="file:./dev.db"\n` + envContent;
  fs.writeFileSync(envPath, envContent, 'utf8');

  console.log('schema.prisma and .env updated to SQLite.');
} else {
  console.log('Switching database provider to PostgreSQL...');
  
  // Replace provider in schema
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schema, 'utf8');

  // Update .env file
  let envContent = '';
  const defaultPostgresUrl = 'postgresql://postgres:postgres@localhost:5432/sat_saheb_trading_co?schema=public';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/^DATABASE_URL=.*$/m, '');
  }
  envContent = `DATABASE_URL="${defaultPostgresUrl}"\n` + envContent;
  fs.writeFileSync(envPath, envContent, 'utf8');

  console.log('schema.prisma and .env updated to PostgreSQL.');
}

// Regenerate Prisma Client
try {
  console.log('Regenerating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma Client regenerated successfully.');
} catch (e) {
  console.error('Failed to regenerate Prisma Client:', e.message);
}
