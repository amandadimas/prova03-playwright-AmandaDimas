import { test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import CristalcopoPage from '../support/pages/cristalCopoPage';

test.describe('Testes funcionais no site da Cristalcopo', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let cristalcopoPage: CristalcopoPage;

  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.cristalcopo')
    .retrieveData();

  test.beforeEach(async ({ page }) => {
    cristalcopoPage = new CristalcopoPage(page);
    await page.goto(BASE_URL);
  });

  test('Validar funcionalidade de contato - preenchimento válido', async () => {
    await cristalcopoPage.preencherCamposValidos();
    await cristalcopoPage.enviarFormulario();
    await cristalcopoPage.validarMensagem();
  });

  test('Validar mensagens de erro ao enviar formulário incompleto', async () => {
    // Não preenche todos os campos obrigatórios
    await cristalcopoPage.preencherApenasNome(); // método novo no page object

    // Tenta enviar o formulário
    await cristalcopoPage.enviarFormulario();

    // Valida se as mensagens de erro aparecem
    await cristalcopoPage.validarMensagensDeErro(); // método novo no page object
  });
});
