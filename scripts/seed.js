const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

async function main() {
  console.log('🌱 Seeding EarnVerse Database...');

  // Clean existing tables for fresh idempotent seed
  await prisma.auditLog.deleteMany();
  await prisma.campaignSubmission.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.offerwallEvent.deleteMany();
  await prisma.withdrawal.deleteMany();
  await prisma.ledgerEntry.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();

  // 1. System Config Singleton
  const config = await prisma.systemConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      emergencyFreeze: false,
      minWithdrawalCoins: 1000,
    },
  });
  console.log('  ✔ System config initialized');

  // 2. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'founder@earnverse.io' },
    update: {
      passwordHash: hashPassword('AdminPassword123!'),
    },
    create: {
      email: 'founder@earnverse.io',
      username: 'admin',
      passwordHash: hashPassword('AdminPassword123!'),
      role: 'ADMIN',
      status: 'ACTIVE',
      trustScore: 100,
      strikes: 0,
      country: 'GLOBAL',
      wallet: {
        create: {
          availableCoins: 100000,
          pendingCoins: 0,
          escrowCoins: 50000,
          lifetimeEarned: 100000,
          lifetimeCashed: 0,
        },
      },
    },
  });
  console.log('  ✔ SuperAdmin user created: @admin');

  // 3. Demo Earners
  const cryptoking = await prisma.user.upsert({
    where: { email: 'cryptoking@earnverse.io' },
    update: {
      passwordHash: hashPassword('Password123!'),
    },
    create: {
      email: 'cryptoking@earnverse.io',
      username: 'cryptoking',
      passwordHash: hashPassword('Password123!'),
      role: 'OPERATOR',
      status: 'ACTIVE',
      trustScore: 100,
      strikes: 0,
      country: 'US',
      wallet: {
        create: {
          availableCoins: 4280,
          pendingCoins: 850,
          escrowCoins: 2500,
          lifetimeEarned: 12450,
          lifetimeCashed: 5000,
        },
      },
    },
  });

  const alexHunter = await prisma.user.upsert({
    where: { email: 'alex@earnverse.io' },
    update: {},
    create: {
      email: 'alex@earnverse.io',
      username: 'alex_hunter',
      role: 'OPERATOR',
      status: 'ACTIVE',
      trustScore: 98,
      strikes: 0,
      country: 'IN',
      wallet: {
        create: {
          availableCoins: 10200,
          pendingCoins: 0,
          escrowCoins: 0,
          lifetimeEarned: 24500,
          lifetimeCashed: 14300,
        },
      },
    },
  });

  const tokyoDrift = await prisma.user.upsert({
    where: { email: 'tokyo@earnverse.io' },
    update: {},
    create: {
      email: 'tokyo@earnverse.io',
      username: 'tokyodrift',
      role: 'OPERATOR',
      status: 'ACTIVE',
      trustScore: 94,
      strikes: 0,
      country: 'JP',
      wallet: {
        create: {
          availableCoins: 15000,
          pendingCoins: 1200,
          escrowCoins: 0,
          lifetimeEarned: 35000,
          lifetimeCashed: 20000,
        },
      },
    },
  });
  console.log('  ✔ Demo earners created (@cryptoking, @alex_hunter, @tokyodrift)');

  // 4. Initial Double-Entry Ledger Entries (ADR-003: 1,000 Coins = $1.00 USD)
  await prisma.ledgerEntry.createMany({
    data: [
      {
        userId: cryptoking.id,
        amount: 2500,
        coinTag: 'EARNED',
        bucket: 'AVAILABLE',
        reasonCode: 'OFFERWALL_CREDIT',
        refType: 'offerwall',
        refId: 'TX_BITLABS_99182',
        idempotencyKey: 'IDEMP_BL_99182',
        meta: JSON.stringify({ network: 'BitLabs', rewardName: 'Mobile Banking Survey' }),
      },
      {
        userId: cryptoking.id,
        amount: 1780,
        coinTag: 'EARNED',
        bucket: 'AVAILABLE',
        reasonCode: 'BOUNTY_REWARD',
        refType: 'submission',
        refId: 'SUB_TIKTOK_01',
        idempotencyKey: 'IDEMP_SUB_TIKTOK_01',
        meta: JSON.stringify({ platform: 'TikTok', views: 42000 }),
      },
    ],
  });
  console.log('  ✔ Ledger entries initialized');

  // 5. Pending Cashout Withdrawals
  await prisma.withdrawal.createMany({
    data: [
      {
        userId: alexHunter.id,
        coins: 10200,
        amountUsd: 10.20,
        rail: 'UPI',
        destination: 'alex.hunter@okaxis',
        status: 'PENDING',
        txRef: 'UPI_PENDING_01',
      },
      {
        userId: tokyoDrift.id,
        coins: 15000,
        amountUsd: 15.00,
        rail: 'USDT_TRC20',
        destination: 'TXYZ88194AaBcd9901FfTRX20',
        status: 'PENDING',
        txRef: 'USDT_PENDING_02',
      },
      {
        userId: cryptoking.id,
        coins: 25000,
        amountUsd: 25.00,
        rail: 'PAYPAL',
        destination: 'cryptoking@paypalsandbox.me',
        status: 'PENDING',
        txRef: 'PP_PENDING_03',
      },
    ],
  });
  console.log('  ✔ Pending withdrawals queued');

  // 6. Sponsored Bounty Campaigns
  const campaignTiktok = await prisma.campaign.create({
    data: {
      title: 'EarnVerse Viral TikTok Sprint',
      platform: 'TIKTOK',
      status: 'ACTIVE',
      poolCoins: 500000, // $500.00 USD
      escrowRemaining: 420000,
      ratePer1k: 250, // 250 coins ($0.25) per 1k views
      description: 'Create high-engagement TikTok clips showcasing the EarnVerse instant cashout terminal.',
      guidelines: 'Include #EarnVerse in description. Video must exceed 10s and remain live for at least 48 hours.',
    },
  });

  const campaignYoutube = await prisma.campaign.create({
    data: {
      title: 'YouTube Shorts Retention Challenge',
      platform: 'YOUTUBE',
      status: 'ACTIVE',
      poolCoins: 250000, // $250.00 USD
      escrowRemaining: 215000,
      ratePer1k: 300,
      description: 'Upload engaging YouTube Shorts reviewing the offerwall gaming payouts.',
      guidelines: 'Tag channel @EarnVerseOfficial and pin comment with your referral link.',
    },
  });
  console.log('  ✔ Active bounty campaigns created');

  // 7. Creator Submissions (Proof Queue)
  await prisma.campaignSubmission.create({
    data: {
      campaignId: campaignTiktok.id,
      userId: cryptoking.id,
      clipUrl: 'https://tiktok.com/@cryptoking/video/729182749102',
      viewsClaimed: 45000,
      coinsReward: 11250,
      status: 'PENDING',
    },
  });
  console.log('  ✔ Proof queue submissions loaded');

  // 8. Offerwall Telemetry Events
  await prisma.offerwallEvent.createMany({
    data: [
      {
        network: 'BITLABS',
        transactionId: 'BL_TX_882910',
        userId: cryptoking.id,
        payoutUsd: 0.85,
        coinsCredited: 850,
        status: 'CREDITED',
        signatureValid: true,
        rawPayload: JSON.stringify({ val: 0.85, user_id: cryptoking.id, tx_id: 'BL_TX_882910' }),
      },
      {
        network: 'CPX',
        transactionId: 'CPX_TX_994102',
        userId: alexHunter.id,
        payoutUsd: 1.20,
        coinsCredited: 1200,
        status: 'CREDITED',
        signatureValid: true,
        rawPayload: JSON.stringify({ amount_local: 1.20, sub_id: alexHunter.id, trans_id: 'CPX_TX_994102' }),
      },
    ],
  });
  console.log('  ✔ Offerwall webhook telemetry events logged');

  console.log('✨ EarnVerse database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
