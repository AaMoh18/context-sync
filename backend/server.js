const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',           // Local development
    'http://localhost:5174',           // Alternative local port
    'https://context-sync.vercel.app', // Your Vercel URL (update after deployment)
    /\.vercel\.app$/                   // Any Vercel preview deployment
  ],
  credentials: true
}));

app.use(express.json());

// Firebase setup
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// AI Response function
const mockAIResponse = (rawText) => {
  const lower = rawText.toLowerCase();
  
  const done = [];
  const progress = [];
  const blockers = [];
  
  // ===== UNIVERSAL DONE DETECTION =====
  
  // Rollbacks (always a completed action)
  if (lower.includes('rolled back')) {
    const commitMatch = rawText.match(/last (\d+) commits?/i);
    const count = commitMatch ? commitMatch[1] : '';
    done.push(`✅ Rolled back ${count} commits - builds passing`);
  }
  
  // Bug fixes (any kind)
  if (lower.includes('fixed') && lower.includes('z-index')) {
    done.push('✅ Fixed z-index bug with modal/sticky header');
  } else if (lower.includes('fixed') && lower.includes('bug')) {
    done.push('✅ Bug fix deployed');
  } else if (lower.includes('fix') && lower.includes('annoying')) {
    done.push('✅ Fixed annoying UI bug');
  }
  
  // PR reviews
  if (lower.includes('reviewed') && lower.includes('pr')) {
    const prMatch = rawText.match(/(\d+) prs?/i);
    const count = prMatch ? prMatch[1] : '';
    done.push(`✅ Reviewed ${count} PRs`);
  }
  
  // Deployments
  if (lower.includes('deploy') || lower.includes('deployed') || lower.includes('shipped')) {
    done.push('✅ Deployed to production/staging');
  }
  
  // Merged code
  if (lower.includes('merged')) {
    done.push('✅ Code merged');
  }
  
  // ===== UNIVERSAL PROGRESS DETECTION =====
  
  // Dashboard/analytics work
  if ((lower.includes('dashboard') || lower.includes('analytics')) && lower.includes('redesign')) {
    progress.push('🔄 Analytics dashboard redesign (recharts → visx)');
  } else if (lower.includes('dashboard') || lower.includes('analytics')) {
    progress.push('🔄 Working on analytics/dashboard');
  }
  
  // Documentation
  if (lower.includes('documentation') || lower.includes('writing doc')) {
    if (lower.includes('webhook')) {
      progress.push('🔄 Writing webhook signature docs (spec changing)');
    } else {
      progress.push('🔄 Writing documentation');
    }
  }
  
  // Mentoring/teaching
  if ((lower.includes('junior') || lower.includes('mentoring')) && lower.includes('stuck')) {
    progress.push('🔄 Mentoring junior dev on JavaScript closures');
  } else if (lower.includes('junior') || lower.includes('mentoring')) {
    progress.push('🔄 Mentoring/onboarding teammate');
  }
  
  if (lower.includes('workshop') || lower.includes('putting together')) {
    progress.push('🔄 Creating mini-workshop materials');
  }
  
  // CI/CD investigations
  if ((lower.includes('ci') || lower.includes('pipeline')) && lower.includes('died')) {
    progress.push('🔄 Debugging CI pipeline failures (OOM/Killed: 9)');
  }
  
  // General active work
  if (lower.includes('making progress') || lower.includes('was making progress')) {
    if (!progress.length) {
      progress.push('🔄 Active development in progress');
    }
  }
  
  if (lower.includes('currently') && lower.includes('trying')) {
    progress.push('🔄 Work in progress - facing obstacles');
  }
  
  // ===== UNIVERSAL BLOCKER DETECTION =====
  
  // Design tokens
  if (lower.includes('design tokens') && lower.includes('publish')) {
    blockers.push('🚫 Blocked: Design tokens not published to npm');
  } else if (lower.includes('design tokens')) {
    blockers.push('🚫 Awaiting design tokens');
  }
  
  // Design system team delays
  if (lower.includes('design system') && lower.includes('refactoring')) {
    blockers.push('🚫 Design system team refactoring - work blocked');
  } else if (lower.includes('design system') && lower.includes('block')) {
    blockers.push('🚫 Blocked on design system team');
  }
  
  // Production logs / data access
  if (lower.includes('production logs') || (lower.includes('prod') && lower.includes('log'))) {
    blockers.push('🚫 No access to production logs for debugging');
  }
  
  // Data privacy blocking reproduction
  if (lower.includes('privacy concern') || (lower.includes('real user data') && lower.includes('can\'t reproduce'))) {
    blockers.push('🚫 Cannot reproduce bug - no production data access');
  }
  
  // Tuesday bug (specific weird one)
  if (lower.includes('tuesday') && lower.includes('bug')) {
    blockers.push('🚫 Mysterious Tuesday-only bug - cannot reproduce');
  }
  
  // Data team delays
  if (lower.includes('data eng') && lower.includes('soon')) {
    blockers.push('🚫 Waiting 2+ weeks for data team snapshot');
  }
  
  // API changes breaking things
  if (lower.includes('api') && lower.includes('without telling')) {
    blockers.push('🚫 Third-party API changed without notice');
  }
  
  if (lower.includes('spec keeps changing')) {
    blockers.push('🚫 Requirements in flux - spec changing');
  }
  
  // Generic blockers (only if nothing specific caught)
  if ((lower.includes('block') || lower.includes('stuck')) && blockers.length === 0) {
    if (lower.includes('release')) {
      blockers.push('🚫 Release blocked - behind schedule');
    } else {
      blockers.push('🚫 External dependency blocking progress');
    }
  }
  
  // ===== SMART FALLBACKS (only when truly empty) =====
  
  if (done.length === 0 && progress.length === 0 && blockers.length === 0) {
    return { 
      done: ['✨ No tasks detected - add more detail!'],
      inProgress: [],
      blockers: []
    };
  }
  
  // If nothing in done but we see "completed/finished" words
  if (done.length === 0 && (lower.includes('done') || lower.includes('completed') || lower.includes('finished'))) {
    done.push('✅ Tasks completed');
  }
  
  // ===== CLEANUP =====
  const uniqueDone = [...new Set(done)];
  const uniqueProgress = [...new Set(progress)];
  const uniqueBlockers = [...new Set(blockers)];
  
  return { 
    done: uniqueDone.slice(0, 5), 
    inProgress: uniqueProgress.slice(0, 5), 
    blockers: uniqueBlockers.slice(0, 5) 
  };
};

// Generate translations
const generateTranslations = (tasks) => {
  const doneCount = tasks.done.length;
  const progressCount = tasks.inProgress.length;
  const blockerCount = tasks.blockers.length;
  
  return {
    managerSummary: blockerCount > 0 
      ? `${doneCount} tasks completed, ${blockerCount} blockers need attention`
      : `Development on track - ${doneCount} tasks completed today`,
    leadSummary: progressCount > 0
      ? `Team actively working on ${progressCount} features, ${doneCount} completed`
      : `Code reviews and planning in progress`
  };
};

// API Endpoint
app.post('/api/translate', async (req, res) => {
  console.log('📥 Received:', req.body.rawText?.substring(0, 60) + '...');
  
  const { rawText, userId = 'dev_01' } = req.body;
  
  if (!rawText) {
    return res.status(400).json({ error: 'Brain dump required' });
  }

  try {
    const categorizedData = mockAIResponse(rawText);
    const translations = generateTranslations(categorizedData);
    
    const syncObject = {
      id: `sync_${Date.now()}`,
      rawText,
      processedData: categorizedData,
      translations: translations,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      author: userId
    };

    await db.collection('updates').add(syncObject);
    console.log('✅ Saved to Firebase');
    
    res.status(200).json({ success: true, data: syncObject });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('🚀 Context-Sync Backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Context-Sync backend running on http://localhost:${PORT}`);
  console.log(`📋 API endpoint: POST http://localhost:${PORT}/api/translate\n`);
});