import { Injectable } from '@nestjs/common';

interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

type EmailTone = 'info' | 'ok' | 'warn' | 'danger';

interface EmailSection {
  title: string;
  html: string;
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
      case 'temporary_occupation_revoked':
        return this.renderDomainNotification(payload, 'Revocacion de ocupacion temporal');
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

    return {
      subject: title,
      html: this.renderTacticalLayout({
        eyebrow: 'Sistema de notificaciones',
        title,
        message,
        tone: this.resolveToneFromPayload(payload, 'info'),
        actionLabel,
        actionUrl,
      }),
      text: `${title}\n\n${message}${actionLabel && actionUrl ? `\n\n${actionLabel}: ${actionUrl}` : ''}`,
    };
  }

  private renderPasswordResetRequest(payload: Record<string, unknown>): RenderedEmail {
    const resetCode = this.toString(payload.resetCode, '');
    const expirationMinutes = this.toString(payload.expirationMinutes, '30');

    return {
      subject: 'Recuperacion de contrasena',
      html: this.renderTacticalLayout({
        eyebrow: 'Seguridad de cuenta',
        title: 'Recuperacion de contrasena',
        message: 'Recibimos una solicitud para restablecer tu contrasena.',
        tone: 'warn',
        sections: [
          {
            title: 'Codigo de verificacion',
            html: this.renderStatusCard('Codigo temporal', this.escapeHtml(resetCode), 'warn'),
          },
          {
            title: 'Ventana de autorizacion',
            html: this.renderStatusCard(
              'Enlace temporal',
              `Este enlace expira en ${this.escapeHtml(expirationMinutes)} minutos.`,
              'warn',
            ),
          },
        ],
      }),
      text: `Recuperacion de contrasena\n\nRecibimos una solicitud para restablecer tu contrasena.\nCodigo temporal: ${resetCode}\nEste codigo expira en ${expirationMinutes} minutos.`,
    };
  }

  private renderPasswordResetConfirmation(payload: Record<string, unknown>): RenderedEmail {
    const dateText = this.toString(payload.dateText, '');

    return {
      subject: 'Contrasena actualizada',
      html: this.renderTacticalLayout({
        eyebrow: 'Seguridad de cuenta',
        title: 'Contrasena actualizada',
        message: 'Tu contrasena se cambio correctamente.',
        tone: 'ok',
        sections: dateText
          ? [
              {
                title: 'Registro de evento',
                html: this.renderStatusCard('Fecha del cambio', this.escapeHtml(dateText), 'ok'),
              },
            ]
          : [],
      }),
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
    const tone = this.resolveToneFromPayload(payload, this.resolveToneFromTitle(title));
    const sections: EmailSection[] = [];

    if (sourceType || sourceId) {
      sections.push({
        title: 'Referencia operacional',
        html: this.renderDetailTable(
          [
            sourceType ? { label: 'Origen', value: sourceType } : null,
            sourceId ? { label: 'Referencia', value: sourceId } : null,
          ].filter((item): item is { label: string; value: string } => item !== null),
        ),
      });
    }

    const customDetails = this.getCustomDetails(payload);
    if (customDetails.length > 0) {
      sections.push({
        title: 'Detalle de solicitud',
        html: this.renderDetailTable(customDetails),
      });
    }

    const changedFields = this.getChangedFields(payload);
    if (changedFields.length > 0) {
      sections.push({
        title: 'Datos modificados',
        html: this.renderChangesTable(changedFields),
      });
    }

    const html = this.renderTacticalLayout({
      eyebrow: 'Canal operacional',
      title,
      message,
      tone,
      sections,
      actionLabel,
      actionUrl,
    });

    const detailsText = [
      sourceType ? `Origen: ${sourceType}` : '',
      sourceId ? `Referencia: ${sourceId}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const changedFieldsText =
      changedFields.length > 0
        ? `\n\nDatos modificados:\n${changedFields
            .map((field) => `- ${field.field}: ${field.previous} -> ${field.current}`)
            .join('\n')}`
        : '';

    const customDetailsText =
      customDetails.length > 0
        ? `\n\nDetalle de solicitud:\n${customDetails
            .map((detail) => `- ${detail.label}: ${detail.value}`)
            .join('\n')}`
        : '';

    const text = [
      title,
      '',
      message,
      detailsText,
      customDetailsText,
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

  private renderTacticalLayout(options: {
    eyebrow: string;
    title: string;
    message: string;
    tone: EmailTone;
    sections?: EmailSection[];
    actionLabel?: string;
    actionUrl?: string;
  }): string {
    const tone = this.getToneStyles(options.tone);
    const sections = options.sections ?? [];
    const sectionBlocks = sections
      .map(
        (section) => `
          <tr>
            <td style="padding:0 0 12px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid rgba(103,172,169,0.24);background:rgba(3,10,10,0.45);">
                <tr>
                  <td style="padding:11px 12px 8px 12px;color:#69bfb7;font-family:Segoe UI,Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;border-bottom:1px solid rgba(103,172,169,0.16);">
                    ${this.escapeHtml(section.title)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 12px 12px 12px;">
                    ${section.html}
                  </td>
                </tr>
              </table>
            </td>
          </tr>`,
      )
      .join('');

    const actionBlock =
      options.actionLabel && options.actionUrl
        ? `
          <tr>
            <td style="padding:4px 0 16px 0;">
              <a href="${this.escapeHtml(options.actionUrl)}" style="display:inline-block;border:1px solid rgba(103,172,169,0.55);background:rgba(4,14,14,0.76);color:#9bd8d6;font-family:Segoe UI,Arial,sans-serif;font-size:11px;font-weight:900;letter-spacing:0.08em;line-height:1;text-decoration:none;text-transform:uppercase;padding:13px 16px;">
                ${this.escapeHtml(options.actionLabel)}
              </a>
            </td>
          </tr>`
        : '';

    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0;padding:0;background:#020808;">
        <tr>
          <td align="center" style="padding:24px 12px;background:#020808;background-image:radial-gradient(circle at 12% 0%, rgba(105,191,183,0.16), transparent 34%),radial-gradient(circle at 100% 0%, rgba(72,197,143,0.12), transparent 32%);">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:660px;border-collapse:collapse;border:1px solid rgba(103,172,169,0.36);background:#040e0e;box-shadow:0 18px 44px rgba(0,0,0,0.38);">
              <tr>
                <td style="padding:0;border-top:3px solid ${tone.border};">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:linear-gradient(135deg, rgba(6,18,18,0.98), rgba(4,14,14,0.96));">
                    <tr>
                      <td style="padding:18px 18px 10px 18px;">
                        <div style="display:inline-block;border:1px solid rgba(103,172,169,0.34);background:rgba(3,10,10,0.58);color:#a4c2c5;font-family:Segoe UI,Arial,sans-serif;font-size:9px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;padding:5px 8px;">
                          End Management System
                        </div>
                      </td>
                      <td align="right" style="padding:18px 18px 10px 8px;">
                        <div style="display:inline-block;border:1px solid ${tone.border};background:${tone.background};color:${tone.color};font-family:Segoe UI,Arial,sans-serif;font-size:9px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;padding:5px 8px;">
                          ${this.escapeHtml(this.toneLabel(options.tone))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding:0 18px 18px 18px;">
                        <div style="color:#69bfb7;font-family:Segoe UI,Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;margin:0 0 8px 0;">
                          ${this.escapeHtml(options.eyebrow)}
                        </div>
                        <h1 style="margin:0;color:#f0fafa;font-family:Segoe UI,Arial,sans-serif;font-size:25px;line-height:1.12;font-weight:900;letter-spacing:0.03em;text-transform:uppercase;">
                          ${this.escapeHtml(options.title)}
                        </h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 18px 18px 18px;background:#040e0e;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:14px 0 14px 0;border-top:1px solid rgba(103,172,169,0.16);border-bottom:1px solid rgba(103,172,169,0.16);">
                        <p style="margin:0;color:rgba(164,194,197,0.86);font-family:Segoe UI,Arial,sans-serif;font-size:14px;line-height:1.62;font-weight:600;">
                          ${this.escapeHtml(options.message)}
                        </p>
                      </td>
                    </tr>
                    ${sectionBlocks}
                    ${actionBlock}
                    <tr>
                      <td style="padding:14px 0 0 0;border-top:1px solid rgba(103,172,169,0.16);">
                        <p style="margin:0;color:rgba(164,194,197,0.58);font-family:Segoe UI,Arial,sans-serif;font-size:10px;line-height:1.5;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;">
                          Mensaje generado automaticamente por el canal operativo de End Management System.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
  }

  private renderDetailTable(details: Array<{ label: string; value: string }>): string {
    const rows = details
      .map(
        (detail) => `
          <tr>
            <td style="padding:9px 10px;border:1px solid rgba(103,172,169,0.22);background:rgba(4,14,14,0.58);color:rgba(164,194,197,0.7);font-family:Segoe UI,Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;width:36%;">
              ${this.escapeHtml(detail.label)}
            </td>
            <td style="padding:9px 10px;border:1px solid rgba(103,172,169,0.22);background:rgba(3,10,10,0.36);color:#f0fafa;font-family:Segoe UI,Arial,sans-serif;font-size:12px;font-weight:800;line-height:1.4;">
              ${this.escapeHtml(detail.value)}
            </td>
          </tr>`,
      )
      .join('');

    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${rows}</table>`;
  }

  private renderChangesTable(
    changedFields: Array<{ field: string; previous: string; current: string }>,
  ): string {
    const rows = changedFields
      .map(
        (field) => `
          <tr>
            <td style="padding:9px;border:1px solid rgba(103,172,169,0.22);color:#f0fafa;font-family:Segoe UI,Arial,sans-serif;font-size:11px;font-weight:900;">${this.escapeHtml(field.field)}</td>
            <td style="padding:9px;border:1px solid rgba(103,172,169,0.22);color:rgba(164,194,197,0.72);font-family:Segoe UI,Arial,sans-serif;font-size:11px;">${this.escapeHtml(field.previous)}</td>
            <td style="padding:9px;border:1px solid rgba(103,172,169,0.22);color:#8ef0bb;font-family:Segoe UI,Arial,sans-serif;font-size:11px;font-weight:800;">${this.escapeHtml(field.current)}</td>
          </tr>`,
      )
      .join('');

    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr>
          <th align="left" style="padding:9px;border:1px solid rgba(103,172,169,0.28);background:rgba(105,191,183,0.1);color:#69bfb7;font-family:Segoe UI,Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;">Campo</th>
          <th align="left" style="padding:9px;border:1px solid rgba(103,172,169,0.28);background:rgba(105,191,183,0.1);color:#69bfb7;font-family:Segoe UI,Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;">Antes</th>
          <th align="left" style="padding:9px;border:1px solid rgba(103,172,169,0.28);background:rgba(105,191,183,0.1);color:#69bfb7;font-family:Segoe UI,Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;">Ahora</th>
        </tr>
        ${rows}
      </table>`;
  }

  private renderStatusCard(label: string, value: string, tone: EmailTone): string {
    const toneStyle = this.getToneStyles(tone);
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid ${toneStyle.border};background:${toneStyle.background};">
        <tr>
          <td style="padding:11px 12px;color:rgba(164,194,197,0.72);font-family:Segoe UI,Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;">${this.escapeHtml(label)}</td>
          <td align="right" style="padding:11px 12px;color:${toneStyle.color};font-family:Segoe UI,Arial,sans-serif;font-size:13px;font-weight:900;line-height:1.3;">${value}</td>
        </tr>
      </table>`;
  }

  private resolveToneFromPayload(payload: Record<string, unknown>, fallback: EmailTone): EmailTone {
    const rawTone = this.toString(payload.tone, '').toLowerCase();
    const rawLevel = this.toString(payload.level, '').toLowerCase();
    const rawType = this.toString(payload.type, '').toLowerCase();
    const value = rawTone || rawLevel || rawType;

    if (value.includes('danger') || value.includes('critical') || value.includes('rechaz')) {
      return 'danger';
    }
    if (value.includes('warn') || value.includes('pending') || value.includes('pendiente')) {
      return 'warn';
    }
    if (value.includes('success') || value.includes('ok') || value.includes('approved')) {
      return 'ok';
    }
    if (value.includes('info')) return 'info';
    return fallback;
  }

  private resolveToneFromTitle(title: string): EmailTone {
    const normalized = title.toLowerCase();
    if (
      normalized.includes('rechaz') ||
      normalized.includes('revoc') ||
      normalized.includes('alerta') ||
      normalized.includes('bajo') ||
      normalized.includes('sobrepoblacion')
    ) {
      return 'danger';
    }

    if (normalized.includes('pendiente') || normalized.includes('evaluada')) return 'warn';
    if (
      normalized.includes('aprob') ||
      normalized.includes('desbloqueado') ||
      normalized.includes('actualizada')
    ) {
      return 'ok';
    }

    return 'info';
  }

  private getToneStyles(tone: EmailTone): { color: string; border: string; background: string } {
    if (tone === 'ok') {
      return {
        color: '#8ef0bb',
        border: 'rgba(72,197,143,0.55)',
        background: 'rgba(52,211,153,0.14)',
      };
    }

    if (tone === 'warn') {
      return {
        color: '#fbd38d',
        border: 'rgba(239,193,110,0.58)',
        background: 'rgba(245,158,11,0.15)',
      };
    }

    if (tone === 'danger') {
      return {
        color: '#fca5a5',
        border: 'rgba(243,123,123,0.58)',
        background: 'rgba(239,68,68,0.13)',
      };
    }

    return {
      color: '#9bd8d6',
      border: 'rgba(103,172,169,0.58)',
      background: 'rgba(103,172,169,0.16)',
    };
  }

  private toneLabel(tone: EmailTone): string {
    if (tone === 'ok') return 'Estable';
    if (tone === 'warn') return 'Atencion';
    if (tone === 'danger') return 'Critico';
    return 'Informativo';
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

  private getCustomDetails(
    payload: Record<string, unknown>,
  ): Array<{ label: string; value: string }> {
    const details =
      typeof payload.details === 'object' && payload.details !== null
        ? (payload.details as Record<string, unknown>)
        : null;

    if (!details) {
      return [];
    }

    return Object.entries(details)
      .filter(([key]) => key !== 'changedFields')
      .map(([key, value]) => ({
        label: this.prettifyDetailLabel(key),
        value: this.formatDetailValue(value),
      }));
  }

  private prettifyDetailLabel(key: string): string {
    const labelMap: Record<string, string> = {
      campName: 'Campamento',
      originCampName: 'Campamento origen',
      destinationCampName: 'Campamento destino',
      campId: 'Campamento',
      originCampId: 'Campamento origen',
      destinationCampId: 'Campamento destino',
      motivo: 'Motivo de asignacion',
      asignadoPor: 'Asignado por',
      revocadoPor: 'Revocado por',
      personaAsignada: 'Persona asignada',
      fechaInicio: 'Fecha de inicio',
      fechaFin: 'Fecha de finalizacion',
    };

    if (labelMap[key]) {
      return labelMap[key];
    }

    return key;
  }

  private formatDetailValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : '-';
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.formatDetailValue(item)).join(', ');
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
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
