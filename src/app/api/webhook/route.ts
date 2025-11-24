import { NextRequest, NextResponse } from 'next/server';

// Base miniapp webhook event types
interface BaseWebhookEvent {
  type: 'app_install' | 'app_uninstall' | 'user_action' | 'transaction' | 'notification';
  data: {
    user?: {
      fid: number;
      username: string;
      displayName: string;
      avatarUrl?: string;
    };
    action?: {
      type: string;
      data: any;
    };
    transaction?: {
      hash: string;
      amount: string;
      token: string;
    };
    timestamp: string;
    appId: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: BaseWebhookEvent = await request.json();
    console.log('Base Miniapp Webhook Event:', {
      type: body.type,
      timestamp: body.data.timestamp,
      appId: body.data.appId
    });

    // Handle different Base miniapp events
    switch (body.type) {
      case 'app_install':
        console.log('🎉 App installed by user:', {
          fid: body.data.user?.fid,
          username: body.data.user?.username,
          displayName: body.data.user?.displayName
        });

        // Trigger welcome sequence or onboarding
        await handleAppInstall(body.data.user);
        break;

      case 'app_uninstall':
        console.log('👋 App uninstalled by user:', {
          fid: body.data.user?.fid,
          username: body.data.user?.username
        });

        // Handle cleanup
        await handleAppUninstall(body.data.user);
        break;

      case 'user_action':
        console.log('⚡ User action:', {
          fid: body.data.user?.fid,
          action: body.data.action?.type,
          actionData: body.data.action?.data
        });

        // Handle user interactions
        await handleUserAction(body.data.user, body.data.action);
        break;

      case 'transaction':
        console.log('💰 Transaction received:', {
          fid: body.data.user?.fid,
          hash: body.data.transaction?.hash,
          amount: body.data.transaction?.amount,
          token: body.data.transaction?.token
        });

        // Handle transaction events
        await handleTransaction(body.data.user, body.data.transaction);
        break;

      case 'notification':
        console.log('🔔 Notification event:', body.data);
        await handleNotification(body.data);
        break;

      default:
        console.log('❓ Unknown webhook type:', body.type);
    }

    return NextResponse.json({
      success: true,
      processed: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Base Webhook Error:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Base Miniapp Webhook Endpoint Active',
    version: '1.0.0',
    supportedEvents: [
      'app_install',
      'app_uninstall',
      'user_action',
      'transaction',
      'notification'
    ],
    timestamp: new Date().toISOString()
  });
}

// Event handlers
async function handleAppInstall(user: any) {
  console.log(`🎊 Welcome! User ${user.displayName} (@${user.username}) installed Mawari Agent`);

  // TODO:
  // - Send welcome notification
  // - Initialize user profile
  // - Create onboarding experience
  // - Track analytics
}

async function handleAppUninstall(user: any) {
  console.log(`👋 Goodbye! User ${user.displayName} (@${user.username}) uninstalled Mawari Agent`);

  // TODO:
  // - Clean up user data
  // - Update analytics
  // - Send feedback request
}

async function handleUserAction(user: any, action: any) {
  console.log(`⚡ User ${user.username} performed action: ${action.type}`);

  // TODO:
  // - Process specific actions
  // - Update user state
  // - Trigger responses
}

async function handleTransaction(user: any, transaction: any) {
  console.log(`💰 Transaction ${transaction.hash} from user ${user.username}`);

  // TODO:
  // - Process payment
  // - Update subscription
  // - Grant access
}

async function handleNotification(data: any) {
  console.log(`🔔 Processing notification:`, data);

  // TODO:
  // - Handle push notifications
  // - Update user preferences
}