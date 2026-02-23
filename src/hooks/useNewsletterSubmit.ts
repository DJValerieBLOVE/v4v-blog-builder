import { useMutation } from '@tanstack/react-query';
import { useBlogSettings } from '@/hooks/useBlogSettings';

interface SubmitEmailParams {
  email: string;
  authorPubkey?: string;
}

/**
 * Hook to submit email to newsletter provider
 */
export function useNewsletterSubmit() {
  const { data: settings } = useBlogSettings();

  return useMutation({
    mutationFn: async ({ email }: SubmitEmailParams) => {
      const provider = settings?.newsletter?.provider;
      const config = settings?.newsletter?.config;

      if (!provider || provider === 'none') {
        // No provider configured - just log and return success
        console.log('Newsletter subscription (no provider):', email);
        return { success: true, message: 'Subscribed (demo mode)' };
      }

      // Dispatch to appropriate provider
      switch (provider) {
        case 'mailchimp':
          return submitToMailchimp(email, config);
        case 'convertkit':
          return submitToConvertKit(email, config);
        case 'buttondown':
          return submitToButtondown(email, config);
        case 'beehiiv':
          return submitToBeehiiv(email, config);
        case 'webhook':
          return submitToWebhook(email, config);
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    },
  });
}

/**
 * Submit to Mailchimp
 */
async function submitToMailchimp(
  email: string,
  config?: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  if (!config?.apiKey || !config?.listId || !config?.server) {
    throw new Error('Mailchimp not configured');
  }

  // Mailchimp requires server-side API calls due to CORS
  // Use a CORS proxy or serverless function
  const proxyUrl = `https://proxy.shakespeare.diy/?url=${encodeURIComponent(
    `https://${config.server}.api.mailchimp.com/3.0/lists/${config.listId}/members`
  )}`;

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Mailchimp subscription failed');
  }

  return { success: true, message: 'Subscribed to Mailchimp' };
}

/**
 * Submit to ConvertKit
 */
async function submitToConvertKit(
  email: string,
  config?: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  if (!config?.apiKey || !config?.formId) {
    throw new Error('ConvertKit not configured');
  }

  const response = await fetch(
    `https://api.convertkit.com/v3/forms/${config.formId}/subscribe`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: config.apiKey,
        email,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('ConvertKit subscription failed');
  }

  return { success: true, message: 'Subscribed to ConvertKit' };
}

/**
 * Submit to Buttondown
 */
async function submitToButtondown(
  email: string,
  config?: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  if (!config?.apiKey) {
    throw new Error('Buttondown not configured');
  }

  const proxyUrl = `https://proxy.shakespeare.diy/?url=${encodeURIComponent(
    'https://api.buttondown.email/v1/subscribers'
  )}`;

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${config.apiKey}`,
    },
    body: JSON.stringify({
      email,
    }),
  });

  if (!response.ok) {
    throw new Error('Buttondown subscription failed');
  }

  return { success: true, message: 'Subscribed to Buttondown' };
}

/**
 * Submit to Beehiiv
 */
async function submitToBeehiiv(
  email: string,
  config?: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  if (!config?.publicationId || !config?.apiKey) {
    throw new Error('Beehiiv not configured');
  }

  const proxyUrl = `https://proxy.shakespeare.diy/?url=${encodeURIComponent(
    `https://api.beehiiv.com/v2/publications/${config.publicationId}/subscriptions`
  )}`;

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
    }),
  });

  if (!response.ok) {
    throw new Error('Beehiiv subscription failed');
  }

  return { success: true, message: 'Subscribed to Beehiiv' };
}

/**
 * Submit to generic webhook
 */
async function submitToWebhook(
  email: string,
  config?: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  if (!config?.url) {
    throw new Error('Webhook not configured');
  }

  const method = config.method ?? 'POST';
  const emailField = config.emailField ?? 'email';

  const proxyUrl = `https://proxy.shakespeare.diy/?url=${encodeURIComponent(config.url)}`;

  const body: Record<string, string> = {
    [emailField]: email,
  };

  const response = await fetch(proxyUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Webhook subscription failed');
  }

  return { success: true, message: 'Subscribed via webhook' };
}
