# 🚀 OblivionID Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ MongoDB instance (local or Atlas)
- ✅ Wallet with MATIC tokens on Polygon Amoy
- ✅ Gemini API key (from Google AI Studio)
- ✅ Pinata account and JWT token
- ✅ WalletConnect Project ID

## Environment Configuration

### 1. Create `.env.local` in the `web` directory

```env
# Wallet Configuration
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Blockchain Configuration
POLYGON_AMOY_RPC=https://polygon-amoy.g.alchemy.com/v2/your_alchemy_key
NEXT_PUBLIC_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/your_alchemy_key
NEXT_PUBLIC_PASSPORT_ADDRESS=0x3780f8b9f618e8e7fd0be2e209617e583f0e325c
NEXT_PUBLIC_VERIFIER_ADDRESS=0xd749736bb339b44639bcaef09ac2248dee0b7a39
NEXT_PUBLIC_ALCHEMY_RPC=https://polygon-amoy.g.alchemy.com/v2/your_alchemy_key

# Database
MONGODB_URI=mongodb://localhost:27017/oblivion
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/oblivion

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# IPFS / Pinata
PINATA_JWT=your_pinata_jwt_token
```

## Local Development

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Start MongoDB

If using local MongoDB:
```bash
mongod --dbpath=/path/to/your/data/directory
```

Or use MongoDB Atlas (cloud).

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Production Build

### 1. Build the Application

```bash
cd web
npm run build
```

This will:
- Optimize all components and pages
- Minify JavaScript and CSS
- Generate static assets
- Create production-ready build in `.next` folder

### 2. Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` to test the production build.

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
cd web
vercel
```

3. **Configure Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add all environment variables from `.env.local`
   - Redeploy

4. **Custom Domain** (optional):
   - Add your domain in Vercel dashboard
   - Update DNS records

### Option 2: Docker

1. **Create `Dockerfile` in `web` directory**:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

2. **Build and Run**:
```bash
docker build -t oblivionid .
docker run -p 3000:3000 --env-file .env.local oblivionid
```

### Option 3: Traditional VPS (Ubuntu)

1. **Install Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2**:
```bash
npm install -g pm2
```

3. **Deploy Application**:
```bash
cd /var/www
git clone <your-repo>
cd OblivionID/web
npm install
npm run build
```

4. **Start with PM2**:
```bash
pm2 start npm --name "oblivionid" -- start
pm2 save
pm2 startup
```

5. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Enable SSL with Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment Checklist

- [ ] Test wallet connection
- [ ] Verify KYC flow (upload files)
- [ ] Test minting process
- [ ] Check dashboard displays correctly
- [ ] Verify contract interactions on PolygonScan
- [ ] Test on mobile devices
- [ ] Monitor error logs
- [ ] Set up monitoring (e.g., Sentry)

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `PRIVATE_KEY` | Wallet private key with MINTER_ROLE | ✅ |
| `NEXT_PUBLIC_WC_PROJECT_ID` | WalletConnect project ID | ✅ |
| `POLYGON_AMOY_RPC` | Polygon Amoy RPC URL | ✅ |
| `NEXT_PUBLIC_PASSPORT_ADDRESS` | OblivionPassport contract address | ✅ |
| `NEXT_PUBLIC_VERIFIER_ADDRESS` | MockVerifier contract address | ✅ |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `PINATA_JWT` | Pinata JWT token for IPFS | ⚠️ Optional |

## Troubleshooting

### Issue: "MINTER_ROLE not granted"

**Solution**: Grant MINTER_ROLE to your backend wallet:
```bash
cd contracts
npx hardhat run scripts/grant-minter-role.ts --network polygonAmoy
```

### Issue: "MongoDB connection failed"

**Solution**: Check MongoDB is running and URI is correct:
```bash
# Test connection
mongosh "your_mongodb_uri"
```

### Issue: "Gemini API error"

**Solution**: The app will use fallback verification if Gemini fails. To fix:
- Check API key is valid
- Ensure API is enabled in Google Cloud Console
- Check API quota limits

### Issue: "Build fails"

**Solution**: Clear cache and rebuild:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Performance Optimization

1. **Enable Redis caching** (for high traffic):
```bash
npm install redis
```

2. **Use CDN** for static assets:
   - Configure in `next.config.mjs`
   - Use Vercel Edge Network or Cloudflare

3. **Database indexing**:
```javascript
// In MongoDB
db.kycSessions.createIndex({ address: 1, createdAt: -1 })
db.kycSessions.createIndex({ sessionId: 1 }, { unique: true })
```

4. **Monitor performance**:
   - Use Vercel Analytics
   - Set up error tracking with Sentry
   - Monitor contract gas usage

## Security Best Practices

1. **Never commit** `.env.local` to git
2. **Rotate keys** regularly
3. **Use environment-specific** MongoDB databases
4. **Enable rate limiting** on API routes
5. **Implement proper** signature verification
6. **Monitor contract** for suspicious activity
7. **Regular security audits** of smart contracts

## Support

For issues or questions:
- Check logs: `pm2 logs oblivionid` (if using PM2)
- Verify contract on PolygonScan
- Review MongoDB logs
- Check browser console for client-side errors

## Production URLs

- **App**: `https://yourdomain.com`
- **Passport Contract**: `https://amoy.polygonscan.com/address/0x3780f8b9f618e8e7fd0be2e209617e583f0e325c`
- **Verifier Contract**: `https://amoy.polygonscan.com/address/0xd749736bb339b44639bcaef09ac2248dee0b7a39`

---

**Built with ❤️ for privacy-preserving identity verification**
