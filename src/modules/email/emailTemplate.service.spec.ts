import { EmailTemplateService } from './emailTemplate.service';

describe('EmailTemplateService', () => {
  let service: EmailTemplateService;

  beforeEach(() => {
    service = new EmailTemplateService();
  });

  describe('render (general routing)', () => {
    it('routes to password reset request', () => {
      const result = service.render('password_reset_request', {
        resetUrl: 'http://test.com',
        expirationMinutes: 15,
      });
      expect(result.subject).toBe('Recuperacion de contrasena');
      expect(result.html).toContain('http://test.com');
      expect(result.text).toContain('15 minutos');
    });

    it('routes to password reset confirmation', () => {
      const result = service.render('password_reset_confirmation', { dateText: '2026-05-15' });
      expect(result.subject).toBe('Contrasena actualizada');
      expect(result.html).toContain('2026-05-15');
    });

    it('routes to domain notification for recognized keys', () => {
      const result = service.render('admission_request_approved', { title: 'Custom Title' });
      expect(result.subject).toBe('Custom Title');
    });

    it('falls back to generic notification for unknown keys', () => {
      const result = service.render('unknown_key', { title: 'Generic' });
      expect(result.subject).toBe('Generic');
    });
  });

  describe('renderGenericNotification', () => {
    it('uses fallbacks when values are missing', () => {
      const result = service.render('generic_notification', {});
      expect(result.subject).toBe('Notificacion del sistema');
      expect(result.html).toContain('Tienes una nueva notificacion.');
    });

    it('escapes HTML in title and message', () => {
      const result = service.render('generic_notification', {
        title: '<script>alert(1)</script>',
        message: 'Normal message',
      });
      expect(result.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
      expect(result.html).not.toContain('<script>');
    });

    it('includes action block when both label and url are provided', () => {
      const result = service.render('generic_notification', {
        actionLabel: 'Click Here',
        actionUrl: 'http://example.com/action?foo=bar&baz=qux',
      });
      expect(result.html).toContain('Click Here');
      expect(result.html).toContain('http://example.com/action?foo=bar&amp;baz=qux');
      expect(result.text).toContain('Click Here: http://example.com/action');
    });
  });

  describe('renderDomainNotification', () => {
    it('renders basic domain notification', () => {
      const result = service.render('role_updated', {
        sourceType: 'user',
        sourceId: '123',
      });
      expect(result.subject).toBe('Rol actualizado');
      expect(result.html).toContain('Origen:</strong> user');
      expect(result.html).toContain('Referencia:</strong> 123');
      expect(result.text).toContain('Origen: user');
    });

    it('renders custom details', () => {
      const result = service.render('role_updated', {
        details: {
          Campamento: 'Camp A',
          Edad: 25,
          Activo: true,
          Nulo: null,
          Array: [1, 2],
          Obj: { a: 1 },
        },
      });

      expect(result.html).toContain('Detalle de solicitud');
      expect(result.html).toContain('Campamento');
      expect(result.html).toContain('Camp A');
      expect(result.html).toContain('Edad');
      expect(result.html).toContain('25');
      expect(result.html).toContain('Activo');
      expect(result.html).toContain('true');
      expect(result.html).toContain('-');
      expect(result.html).toContain('1, 2');
      expect(result.html).toContain('{&quot;a&quot;:1}');
    });

    it('renders changed fields from top level', () => {
      const result = service.render('role_updated', {
        changedFields: [{ field: 'Rol', previous: 'WORKER', current: 'RESOURCE_MANAGEMENT' }],
      });
      expect(result.html).toContain('Datos modificados');
      expect(result.html).toContain('Rol');
      expect(result.html).toContain('WORKER');
      expect(result.html).toContain('RESOURCE_MANAGEMENT');
      expect(result.text).toContain('- Rol: WORKER -> RESOURCE_MANAGEMENT');
    });

    it('renders changed fields from details level', () => {
      const result = service.render('role_updated', {
        details: {
          changedFields: [{ field: 'Status', previous: 'ACTIVE', current: 'INACTIVE' }],
        },
      });
      expect(result.html).toContain('Status');
      expect(result.html).toContain('INACTIVE');
    });

    it('handles empty or malformed changedFields gracefully', () => {
      const result1 = service.render('role_updated', { changedFields: {} });
      expect(result1.html).not.toContain('Datos modificados');

      const result2 = service.render('role_updated', { changedFields: ['not an object'] });
      expect(result2.html).not.toContain('Datos modificados');
    });

    it('handles formatting dates in details', () => {
      const date = new Date('2026-05-15T10:00:00.000Z');
      const result = service.render('role_updated', {
        details: { Fecha: date },
      });
      expect(result.html).toContain('2026-05-15T10:00:00.000Z');
    });
  });
});
