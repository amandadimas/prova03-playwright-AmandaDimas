import { Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import CristalcopoElements from '../elements/cristalCopoElements';
import BasePage from './BasePage';

export default class CristalcopoPage extends BasePage {
  readonly cristalcopoElements: CristalcopoElements;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.cristalcopoElements = new CristalcopoElements(page);
  }

  /**
   * Preenche todos os campos do formulário com dados válidos e aleatórios.
   * Fecha o banner de cookies antes de iniciar, caso esteja visível.
   */
  async preencherCamposValidos(): Promise<void> {
    // Fecha aviso de cookies (caso apareça)
    await this.cristalcopoElements.aceitarCookies();

    // Aguarda o campo "Nome" aparecer para garantir que o formulário carregou
    await this.cristalcopoElements.getCampoNome().waitFor({ state: 'visible' });

    // Preenche os campos com dados gerados pelo faker
    await this.cristalcopoElements.getCampoNome().fill(faker.person.fullName());
    await this.cristalcopoElements.getCampoEmpresa().fill(faker.company.name());
    await this.cristalcopoElements
      .getCampoTelefone()
      .fill(faker.helpers.replaceSymbols('## ####-####'));
    await this.cristalcopoElements.getCampoEmail().fill(faker.internet.email());
    await this.cristalcopoElements
      .getCampoAssunto()
      .fill('Dúvidas sobre produtos');
    await this.cristalcopoElements
      .getCampoMensagem()
      .fill(faker.lorem.sentences(2));
  }

  /**
   * Preenche apenas o campo "Nome", simulando envio incompleto.
   */
  async preencherApenasNome(): Promise<void> {
    // Fecha aviso de cookies (caso apareça)
    await this.cristalcopoElements.aceitarCookies();

    await this.cristalcopoElements.getCampoNome().waitFor({ state: 'visible' });
    await this.cristalcopoElements.getCampoNome().fill('Teste Incompleto');
  }

  /**
   * Marca o checkbox de concordância (se visível) e envia o formulário.
   */
  async enviarFormulario(): Promise<void> {
    // Se o checkbox de concordância estiver visível, marca
    const checkbox = this.cristalcopoElements.getCheckConcordo();
    if (await checkbox.isVisible()) {
      await checkbox.check();
    }

    // Garante que o botão está visível e clica
    const botao = this.cristalcopoElements.getBotaoEnviar();
    await botao.scrollIntoViewIfNeeded();
    await expect(botao).toBeVisible();
    await botao.click();
  }

  /**
   * Valida se a mensagem de sucesso é exibida após o envio do formulário.
   */
  async validarMensagem(): Promise<void> {
    await expect(this.cristalcopoElements.getMensagemSucesso()).toBeVisible({
      timeout: 10000
    });
  }

  /**
   * Valida se mensagens de erro são exibidas ao tentar enviar formulário incompleto.
   */
  async validarMensagensDeErro(): Promise<void> {
    // Seleciona todos os campos obrigatórios do formulário
    const requiredFields = await this.page.locator('form [required]').all();

    let algumInvalido = false;

    // Percorre todos e checa se algum está inválido
    for (const field of requiredFields) {
      const valido = await field.evaluate(el =>
        (el as HTMLInputElement).checkValidity()
      );
      if (!valido) {
        algumInvalido = true;
        break;
      }
    }

    await this.page.waitForTimeout(1000);

    expect(algumInvalido).toBeTruthy();

    await expect(
      this.cristalcopoElements.getMensagemSucesso()
    ).not.toBeVisible();
  }
}
