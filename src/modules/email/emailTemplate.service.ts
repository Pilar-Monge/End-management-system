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
      case 'admission_request_pending':
        return this.renderDomainNotification(payload, 'Solicitud de admision recibida');
      case 'admission_request_ai_reviewed':
        return this.renderDomainNotification(payload, 'Solicitud evaluada por IA');
      case 'admission_request_approved':
        return this.renderDomainNotification(payload, 'Solicitud de admision aprobada');
      case 'admission_request_rejected':
        return this.renderDomainNotification(payload, 'Solicitud de admision rechazada');
      case 'role_updated':
        return this.renderDomainNotification(payload, 'Rol actualizado');
      case 'user_status_updated':
        return this.renderDomainNotification(payload, 'Estado de usuario actualizado');
      case 'inventory_alert':
        return this.renderDomainNotification(payload, 'Alerta de inventario bajo');
      case 'overpopulation_alert':
        return this.renderDomainNotification(payload, 'Alerta de sobrepoblacion');
      case 'occupation_without_staff':
        return this.renderDomainNotification(payload, 'Ocupacion sin personal asignado');
      case 'intercamp_request_received':
      case 'intercamp_request_approved':
      case 'intercamp_request_rejected':
      case 'intercamp_request_canceled':
        return this.renderDomainNotification(payload, 'Solicitud intercampamento actualizada');
      case 'transfer_pending':
      case 'transfer_completed':
      case 'transfer_canceled':
      case 'transfer_person_updated':
      case 'transfer_resource_recorded':
      case 'request_person_detail_updated':
      case 'request_resource_detail_updated':
        return this.renderDomainNotification(payload, 'Actualizacion de transferencia');
      case 'expedition_return':
      case 'expedition_status_updated':
      case 'expedition_created':
      case 'expedition_completed':
      case 'expedition_resource_consumed':
      case 'expedition_resource_obtained':
        return this.renderDomainNotification(payload, 'Actualizacion de expedicion');
      case 'person_status_changed':
        return this.renderDomainNotification(payload, 'Estado de persona actualizado');
      case 'temporary_occupation_assigned':
        return this.renderDomainNotification(payload, 'Asignacion temporal de ocupacion');
      case 'camp_achievement_unlocked':
        return this.renderDomainNotification(payload, 'Logro desbloqueado');
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

  private renderDomainNotification(
    payload: Record<string, unknown>,
    defaultSubject: string,
  ): RenderedEmail {
    const title = this.toString(payload.title, defaultSubject);
    const message = this.toString(payload.message, 'Hay una nueva actualizacion del sistema.');
    const actionLabel = this.toString(payload.actionLabel, '');
    const actionUrl = this.toString(payload.actionUrl, '');
    const sourceType = this.toString(payload.sourceType, '');
    const sourceId = this.toString(payload.sourceId, '');

    const detailsRows: string[] = [];
    if (sourceType) {
      detailsRows.push(`<li><strong>Origen:</strong> ${this.escapeHtml(sourceType)}</li>`);
    }
    if (sourceId) {
      detailsRows.push(`<li><strong>Referencia:</strong> ${this.escapeHtml(sourceId)}</li>`);
    }

    const detailsBlock =
      detailsRows.length > 0
        ? `<ul style="padding-left:18px;margin:8px 0 0 0;">${detailsRows.join('')}</ul>`
        : '';

    const changedFields = this.getChangedFields(payload);
    const changesBlock =
      changedFields.length > 0
        ? `<div style="margin-top:14px;"><p style="margin:0 0 8px 0;font-weight:600;color:#134e4a;">Datos modificados</p><table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr><th style="text-align:left;padding:8px;border:1px solid #d1d5db;background:#f0fdfa;">Campo</th><th style="text-align:left;padding:8px;border:1px solid #d1d5db;background:#f0fdfa;">Antes</th><th style="text-align:left;padding:8px;border:1px solid #d1d5db;background:#f0fdfa;">Ahora</th></tr></thead><tbody>${changedFields
            .map(
              (field) =>
                `<tr><td style="padding:8px;border:1px solid #d1d5db;">${this.escapeHtml(field.field)}</td><td style="padding:8px;border:1px solid #d1d5db;">${this.escapeHtml(field.previous)}</td><td style="padding:8px;border:1px solid #d1d5db;">${this.escapeHtml(field.current)}</td></tr>`,
            )
            .join('')}</tbody></table></div>`
        : '';

    const actionBlock =
      actionLabel && actionUrl
        ? `<p style="margin-top:16px;"><a href="${this.escapeHtml(actionUrl)}" style="display:inline-block;padding:10px 14px;background:#0f766e;color:#ffffff;text-decoration:none;border-radius:6px;">${this.escapeHtml(actionLabel)}</a></p>`
        : '';

    const html = [
      '<div style="font-family:Segoe UI,Arial,sans-serif;max-width:620px;line-height:1.45;color:#0f172a;">',
      `<h2 style="margin:0 0 10px 0;color:#134e4a;">${this.escapeHtml(title)}</h2>`,
      `<p style="margin:0 0 10px 0;">${this.escapeHtml(message)}</p>`,
      detailsBlock,
      changesBlock,
      actionBlock,
      '<p style="margin-top:18px;color:#475569;font-size:12px;">Este mensaje fue generado automaticamente por End Management System.</p>',
      '</div>',
    ].join('');

    const detailsText = [
      sourceType ? `Origen: ${sourceType}` : '',
      sourceId ? `Referencia: ${sourceId}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const changedFieldsText =
      changedFields.length > 0
        ? `\n\nDatos modificados:\n${changedFields
            .map(
              (field) => `- ${field.field}: ${field.previous} -> ${field.current}`,
            )
            .join('\n')}`
        : '';

    const text = [
      title,
      '',
      message,
      detailsText,
      changedFieldsText,
      actionLabel && actionUrl ? `${actionLabel}: ${actionUrl}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      subject: title,
      html,
      text,
    };
  }

  private getChangedFields(
    payload: Record<string, unknown>,
  ): Array<{ field: string; previous: string; current: string }> {
    const details =
      typeof payload.details === 'object' && payload.details !== null
        ? (payload.details as Record<string, unknown>)
        : null;

    const raw = Array.isArray(payload.changedFields)
      ? payload.changedFields
      : Array.isArray(details?.changedFields)
        ? details.changedFields
        : null;

    if (!Array.isArray(raw)) {
      return [];
    }

    return raw
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        field: this.toString(item.field, 'Campo'),
        previous: this.toString(item.previous, '-'),
        current: this.toString(item.current, '-'),
      }));
  }

  private toString(value: unknown, fallback: string): string {
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (typeof value !== 'string') return fallback;

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
