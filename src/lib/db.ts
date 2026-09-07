// Hostinger Premium Static Build Safe Database Shim
// Prevents SQLite/Prisma from executing or bundling in production
const emptyHandler: ProxyHandler<any> = {
  get: () => () => Promise.resolve(null),
}

export const db: any = new Proxy({}, {
  get: () => new Proxy({}, emptyHandler),
})
