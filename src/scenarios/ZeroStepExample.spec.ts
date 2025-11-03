import { test, expect } from '@playwright/test';
import { ai } from '@zerostep/playwright';

test('zerostep example - send form and validate error message', async ({
  page
}) => {
  await page.goto('https://cristalcopo.com.br/contato/');

  const aiArgs = { page, test };

  // Fill the full name field
  await ai('enter values in full name field', aiArgs);

  // Click the Send button
  //await ai('Click the Submit button and validate error messages.', aiArgs);
  await ai('Enviar formulário.', aiArgs);

  // Validate that an error message appears
  /*await ai(
    'check that an error or alert message appears indicating required fields',
    aiArgs
  );*/
});
