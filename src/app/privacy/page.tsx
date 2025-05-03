'use client';

import Link from 'next/link';
import * as React from 'react';

export default function PrivacyPage() {
  return (
    <main className='bg-background min-h-screen'>
      <div className='container mx-auto max-w-3xl px-4 py-12'>
        <div className='mb-4'>
          <Link href='/' className='text-primary hover:underline'>
            ← Zurück zur Startseite
          </Link>
        </div>

        <h1 className='mb-8 text-4xl font-bold'>Datenschutzerklärung</h1>

        <div className='prose dark:prose-invert max-w-none'>
          <p className='mb-6 text-lg'>
            Zuletzt aktualisiert:{' '}
            {new Date().toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              1. Einleitung und Verantwortlicher
            </h2>
            <p>
              Diese Datenschutzerklärung erläutert, wie SEPA QR Generator
              ("wir", "uns" oder "unser") Ihre personenbezogenen Daten bei der
              Nutzung unseres Dienstes erfasst, verwendet und schützt. Wir
              verpflichten uns, Ihre Privatsphäre zu gewährleisten und Ihre
              Daten gemäß der Datenschutz-Grundverordnung (DSGVO) zu schützen.
            </p>
            <div className='mt-4'>
              <p>Verantwortlicher im Sinne der DSGVO ist:</p>
              <p>Simon Schräder</p>
              <p>Kontaktinformationen finden Sie unter:</p>
              <p>
                <a
                  href='https://www.mrsimon.dev/contact'
                  className='text-primary hover:underline'
                >
                  https://www.mrsimon.dev/contact
                </a>
              </p>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              2. Informationen, die wir sammeln
            </h2>
            <p>
              Bei der Nutzung unseres Dienstes erfassen und verarbeiten wir
              folgende Daten:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                Zahlungsinformationen, die Sie eingeben (IBAN, Empfängername,
                Betrag und Verwendungszweck)
              </li>
              <li>Bilder, die Sie zur Analyse hochladen</li>
              <li>Textinhalte, die Sie zur Analyse einreichen</li>
              <li>Technische Informationen wie IP-Adresse und Browsertyp</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              3. Rechtsgrundlagen der Verarbeitung
            </h2>
            <p>
              Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf
              folgender Rechtsgrundlage:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                Für die Bereitstellung unseres Dienstes: Art. 6 Abs. 1 lit. b
                DSGVO (Vertragserfüllung)
              </li>
              <li>
                Für die Verbesserung unseres Dienstes: Art. 6 Abs. 1 lit. f
                DSGVO (berechtigtes Interesse)
              </li>
              <li>
                Für die Bot-Erkennung: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                Interesse)
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              4. Drittanbieterdienste
            </h2>
            <h3 className='mb-3 text-xl font-semibold'>Cloudflare Turnstile</h3>
            <p>
              Wir verwenden Cloudflare Turnstile zum Schutz vor Bots. Bei der
              Interaktion mit unserem Dienst kann Turnstile bestimmte Daten
              erfassen und verarbeiten, um zu überprüfen, dass Sie ein Mensch
              sind. Diese Datenverarbeitung unterliegt der{' '}
              <a
                href='https://www.cloudflare.com/privacy/'
                className='text-primary hover:underline'
              >
                Datenschutzerklärung von Cloudflare
              </a>
              .
            </p>

            <h3 className='mb-3 mt-4 text-xl font-semibold'>OpenRouter</h3>
            <p>
              Wir nutzen OpenRouter für die KI-gestützte Analyse von Bildern und
              Texten. Wenn Sie Inhalte zur Analyse einreichen, werden diese über
              den API-Dienst von OpenRouter verarbeitet. Diese Verarbeitung
              unterliegt der{' '}
              <a
                href='https://openrouter.ai/privacy'
                className='text-primary hover:underline'
              >
                Datenschutzerklärung von OpenRouter
              </a>
              .
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              5. Datenspeicherung und Sicherheit
            </h2>
            <p>
              Wir speichern Ihre Zahlungsinformationen oder hochgeladenen
              Inhalte nicht permanent. Alle Daten werden im Arbeitsspeicher
              verarbeitet und nach der Generierung des QR-Codes oder Abschluss
              der Analyse verworfen. Wir setzen angemessene technische und
              organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten während
              der Verarbeitung zu schützen.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              6. Cookies und Tracking
            </h2>
            <p>
              Unsere Website verwendet keine Tracking-Cookies. Wir setzen
              lediglich technisch notwendige Cookies ein, die für den Betrieb
              der Website erforderlich sind.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              7. Ihre Rechte gemäß DSGVO
            </h2>
            <p>Sie haben folgende Rechte:</p>
            <ul className='mt-2 list-disc pl-6'>
              <li>Das Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Das Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Das Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>
                Das Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
              </li>
              <li>Das Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Das Recht auf Widerspruch (Art. 21 DSGVO)</li>
            </ul>
            <p className='mt-4'>
              Sie haben zudem das Recht, sich bei einer
              Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
              personenbezogenen Daten zu beschweren.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              8. Kontaktinformationen
            </h2>
            <p>
              Für datenschutzbezogene Fragen oder zur Ausübung Ihrer
              DSGVO-Rechte kontaktieren Sie uns bitte unter:{' '}
              <a
                href='https://www.mrsimon.dev/contact'
                className='text-primary hover:underline'
              >
                https://www.mrsimon.dev/contact
              </a>
            </p>
          </section>
        </div>

        <div className='mt-8'>
          <Link href='/' className='text-primary hover:underline'>
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
