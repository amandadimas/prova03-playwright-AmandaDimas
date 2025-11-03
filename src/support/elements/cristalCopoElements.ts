import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class CristalcopoElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  // Campos do formulário
  getCampoNome(): Locator {
    return this.page.locator('#input_1_1');
  }

  getCampoAssunto(): Locator {
    return this.page.locator('#input_1_6');
  }

  getCampoEmpresa(): Locator {
    return this.page.locator('#input_1_2');
  }

  getCampoTelefone(): Locator {
    return this.page.locator('#input_1_3');
  }

  getCampoEmail(): Locator {
    return this.page.locator('#input_1_5');
  }

  getCampoMensagem(): Locator {
    return this.page.locator('#input_1_7');
  }

  // Checkbox de política
  getCheckConcordo(): Locator {
    return this.page.locator('#input_1_8_1 input[type="checkbox"]');
  }

  // Botões
  getBotaoEnviar(): Locator {
    return this.page.locator('#gform_submit_button_1');
  }

  /**
   * Botão de aceitar cookies
   * Usa o papel (role) "button" e o texto visível "Aceitar Cookies".
   * Isso evita conflitos e funciona mesmo que existam vários elementos semelhantes.
   */
  getBotaoAceitarCookies(): Locator {
    return this.page.getByRole('button', { name: 'Aceitar Cookies' });
  }

  /**
   * Aguarda o botão de cookies e clica com segurança.
   * Pode ser chamado no início dos testes para garantir que o banner desapareça.
   */
  async aceitarCookies(): Promise<void> {
    const botao = this.getBotaoAceitarCookies();
    if (await botao.isVisible()) {
      await botao.waitFor({ state: 'visible', timeout: 5000 });
      await botao.click();
    }
  }

  // Mensagem de sucesso (quando houver)
  getMensagemSucesso(): Locator {
    return this.page.getByText('Obrigado por entrar em contato', {
      exact: false
    });
  }
}
