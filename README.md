# ASOPADRES CCSDS

Sitio web de la Asociación de Padres de Familia del Colegio Campestre Santo Domingo Savio (ASOPADRES CCSDS), Anolaima, Cundinamarca: https://www.asopadresccsds.org

Sitio trilingüe (es / en / fr) con información institucional, comunicados, afiliaciones, donaciones para el proyecto de la cancha cubierta y un panel de administración.

## Stack

- Next.js 15 (App Router) y TypeScript
- Tailwind CSS
- next-intl (traducciones en `messages/`)
- Supabase (base de datos y autenticación, `@supabase/ssr`)
- Pagos: Wompi y PayPal (webhooks en `app/api/webhooks`)
- Correo: Resend

## Desarrollo local

```bash
npm ci
cp .env.example .env.local   # completar los valores
npm run dev
```

Abrir http://localhost:3000. Otros comandos: `npm run build`, `npm run lint`.

## Variables de entorno

Todas las variables están documentadas en `.env.example`. Nunca se versionan valores reales.

## Base de datos

Las migraciones de Supabase están en `supabase/migrations/` y se aplican en orden numérico (SQL editor de Supabase o CLI).

## Despliegue

Vercel, proyecto `asopadresccsds-v2`. La rama `main` despliega a producción; el resto de ramas generan previews. Las variables de entorno se configuran en Vercel.

## Acceso al panel admin

- URL: `/admin/login`
- Los usuarios se crean en Supabase Auth (email y contraseña) con el email confirmado.
- Además, el email debe estar en la variable `ADMIN_EMAILS` (lista separada por comas). Si está vacía, nadie tiene acceso.
