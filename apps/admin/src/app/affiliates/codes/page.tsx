/**
 * Wave 60.62.T1.2 — legacy route preserved for back-compat. 308 redirect
 * into the consolidated /affiliates tabbed page.
 */

import { permanentRedirect } from 'next/navigation';

export default function CodesRedirect() {
  permanentRedirect('/affiliates?tab=codes');
}
