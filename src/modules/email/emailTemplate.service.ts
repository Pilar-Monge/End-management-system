import { Injectable } from '@nestjs/common';

interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class EmailTemplateService {
  render(templateKey: string, payload: Record<string, unknown>): RenderedEmail {
    switch (templateKey) {
      case 'password_reset_request':
        return this.renderPasswordResetRequest(payload);
      case 'password_reset_confirmation':
        return this.renderPasswordResetConfirmation(payload);
      case 'generic_notification':
      default:
        return this.renderGenericNotification(payload);
    }
  }

  private renderGenericNotification(payload: Record<string, unknown>): RenderedEmail {
    const title = this.toString(payload.title, 'Notificacion del sistema');
    const message = this.toString(payload.message, 'Tienes una nueva notificacion.');
    const actionLabel = this.toString(payload.actionLabel, '');
    const actionUrl = this.toString(payload.actionUrl, '');

    const actionBlock =
      actionLabel && actionUrl
        ? `<p><a href="${this.escapeHtml(actionUrl)}">${this.escapeHtml(actionLabel)}</a></p>`
        : '';

    return {
      subject: title,
      html: `<h2>${this.escapeHtml(title)}</h2><p>${this.escapeHtml(message)}</p>${actionBlock}`,
      text: `${title}\n\n${message}${actionLabel && actionUrl ? `\n\n${actionLabel}: ${actionUrl}` : ''}`,
    };
  }

  private renderPasswordResetRequest(payload: Record<string, unknown>): RenderedEmail {
    const resetUrl = this.toString(payload.resetUrl, '');
    const expirationMinutes = this.toString(payload.expirationMinutes, '30');

    return {
      subject: 'Recuperacion de contrasena',
      html: `<h2>Recuperacion de contrasena</h2><p>Recibimos una solicitud para restablecer tu contrasena.</p><p>Este enlace expira en ${this.escapeHtml(expirationMinutes)} minutos.</p><p><a href="${this.escapeHtml(resetUrl)}">Restablecer contrasena</a></p>`,
      text: `Recuperacion de contrasena\n\nRecibimos una solicitud para restablecer tu contrasena.\nEste enlace expira en ${expirationMinutes} minutos.\nRestablecer contrasena: ${resetUrl}`,
    };
  }

  private renderPasswordResetConfirmation(payload: Record<string, unknown>): RenderedEmail {
    const dateText = this.toString(payload.dateText, '');

    return {
      subject: 'Contrasena actualizada',
      html: `<h2>Contrasena actualizada</h2><p>Tu contrasena se cambio correctamente.</p><p>Fecha del cambio: ${this.escapeHtml(dateText)}</p>`,
      text: `Contrasena actualizada\n\nTu contrasena se cambio correctamente.\nFecha del cambio: ${dateText}`,
    };
  }

  private toString(value: unknown, fallback: string): string {
    if (typeof value !== 'string') {
      return fallback;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return fallback;
    }

    return trimmed;
  }

  private escapeHtml(raw: string): string {
    return raw
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
