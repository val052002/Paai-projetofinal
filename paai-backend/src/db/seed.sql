-- =========================================================
-- ISO 27001:2022 Annex A Controls Seed
-- 93 controls across 4 domains
-- Run AFTER schema.sql
-- =========================================================

INSERT INTO public.controlos_iso (codigo, titulo, dominio, recomendacao) VALUES

-- =========================================================
-- A.5 Organizational Controls (37)
-- =========================================================
('5.1',  'Políticas de segurança da informação',                                        'Organizacional', 'Definir, aprovar e comunicar políticas de segurança da informação a todos os colaboradores.'),
('5.2',  'Funções e responsabilidades de segurança da informação',                      'Organizacional', 'Atribuir e documentar responsabilidades de segurança a funções específicas.'),
('5.3',  'Segregação de funções',                                                        'Organizacional', 'Separar funções conflituosas para reduzir o risco de acesso não autorizado ou uso indevido.'),
('5.4',  'Responsabilidades da gestão',                                                  'Organizacional', 'A gestão deve demonstrar liderança e comprometimento com a segurança da informação.'),
('5.5',  'Contacto com autoridades',                                                     'Organizacional', 'Manter contactos atualizados com autoridades relevantes (reguladores, forças de segurança).'),
('5.6',  'Contacto com grupos de interesse especial',                                    'Organizacional', 'Participar em fóruns e grupos especializados para manter o conhecimento atualizado.'),
('5.7',  'Inteligência sobre ameaças',                                                   'Organizacional', 'Recolher e analisar informações sobre ameaças para suportar decisões de segurança.'),
('5.8',  'Segurança da informação na gestão de projetos',                                'Organizacional', 'Integrar requisitos de segurança em todas as fases dos projetos.'),
('5.9',  'Inventário de informações e outros ativos associados',                         'Organizacional', 'Manter um inventário atualizado de todos os ativos de informação e responsáveis.'),
('5.10', 'Uso aceitável de informações e outros ativos associados',                      'Organizacional', 'Definir e comunicar regras de uso aceitável de ativos de informação.'),
('5.11', 'Devolução de ativos',                                                          'Organizacional', 'Assegurar a devolução de todos os ativos aquando da saída de colaboradores ou fornecedores.'),
('5.12', 'Classificação da informação',                                                  'Organizacional', 'Classificar a informação de acordo com requisitos legais, valor e criticidade.'),
('5.13', 'Rotulagem da informação',                                                      'Organizacional', 'Aplicar rótulos adequados à classificação da informação em todos os suportes.'),
('5.14', 'Transferência de informação',                                                  'Organizacional', 'Estabelecer políticas e procedimentos para transferência segura de informação.'),
('5.15', 'Controlo de acesso',                                                           'Organizacional', 'Implementar políticas de controlo de acesso baseadas em necessidade de conhecimento.'),
('5.16', 'Gestão de identidades',                                                        'Organizacional', 'Gerir o ciclo de vida completo das identidades digitais dos utilizadores.'),
('5.17', 'Informação de autenticação',                                                   'Organizacional', 'Gerir informação de autenticação de forma segura, incluindo passwords e certificados.'),
('5.18', 'Direitos de acesso',                                                           'Organizacional', 'Provisionar, rever e revogar direitos de acesso conforme o princípio do menor privilégio.'),
('5.19', 'Segurança da informação nas relações com fornecedores',                        'Organizacional', 'Definir e acordar requisitos de segurança com todos os fornecedores relevantes.'),
('5.20', 'Tratamento da segurança da informação nos acordos com fornecedores',           'Organizacional', 'Incluir cláusulas de segurança nos contratos com fornecedores.'),
('5.21', 'Gestão da segurança da informação na cadeia de fornecimento de TIC',           'Organizacional', 'Avaliar e monitorizar riscos de segurança na cadeia de fornecimento tecnológica.'),
('5.22', 'Monitorização, revisão e gestão de mudanças dos serviços de fornecedores',     'Organizacional', 'Rever regularmente o desempenho de segurança dos fornecedores e gerir mudanças.'),
('5.23', 'Segurança da informação para utilização de serviços na nuvem',                 'Organizacional', 'Definir e implementar controlos para uso seguro de serviços cloud.'),
('5.24', 'Planeamento e preparação da gestão de incidentes de segurança da informação',  'Organizacional', 'Estabelecer processo documentado de gestão de incidentes com papéis definidos.'),
('5.25', 'Avaliação e decisão sobre eventos de segurança da informação',                 'Organizacional', 'Definir critérios para classificar eventos como incidentes e escalar adequadamente.'),
('5.26', 'Resposta a incidentes de segurança da informação',                             'Organizacional', 'Responder a incidentes segundo procedimentos documentados e testar regularmente.'),
('5.27', 'Aprendizagem com incidentes de segurança da informação',                       'Organizacional', 'Analisar incidentes para identificar causas raiz e melhorar controlos.'),
('5.28', 'Recolha de evidências',                                                        'Organizacional', 'Recolher, preservar e gerir evidências de incidentes para suporte legal ou disciplinar.'),
('5.29', 'Segurança da informação durante perturbações',                                 'Organizacional', 'Planear a manutenção de segurança durante interrupções operacionais.'),
('5.30', 'Prontidão das TIC para continuidade do negócio',                              'Organizacional', 'Assegurar que as TIC suportam os objetivos de continuidade do negócio.'),
('5.31', 'Requisitos legais, estatutários, regulamentares e contratuais',                'Organizacional', 'Identificar e cumprir todos os requisitos legais e regulamentares aplicáveis.'),
('5.32', 'Direitos de propriedade intelectual',                                          'Organizacional', 'Proteger direitos de propriedade intelectual e assegurar uso licenciado de software.'),
('5.33', 'Proteção de registos',                                                         'Organizacional', 'Proteger registos contra perda, destruição, falsificação e acesso não autorizado.'),
('5.34', 'Privacidade e proteção de dados pessoais',                                     'Organizacional', 'Implementar controlos para proteção de dados pessoais conforme legislação aplicável (RGPD).'),
('5.35', 'Revisão independente da segurança da informação',                              'Organizacional', 'Realizar auditorias independentes ao SGSI para garantir eficácia e conformidade.'),
('5.36', 'Conformidade com políticas e normas de segurança da informação',               'Organizacional', 'Verificar regularmente a conformidade com políticas internas de segurança.'),
('5.37', 'Procedimentos operacionais documentados',                                      'Organizacional', 'Documentar e manter atualizados os procedimentos operacionais de segurança.'),

-- =========================================================
-- A.6 People Controls (8)
-- =========================================================
('6.1', 'Seleção e verificação',                                                         'Pessoas', 'Verificar antecedentes de candidatos antes da contratação conforme legislação aplicável.'),
('6.2', 'Termos e condições de emprego',                                                 'Pessoas', 'Incluir responsabilidades de segurança nos contratos e acordos de confidencialidade.'),
('6.3', 'Sensibilização, educação e formação em segurança da informação',                'Pessoas', 'Fornecer formação regular em segurança da informação a todos os colaboradores.'),
('6.4', 'Processo disciplinar',                                                          'Pessoas', 'Dispor de processo disciplinar formal para violações de segurança da informação.'),
('6.5', 'Responsabilidades após cessação ou mudança de emprego',                         'Pessoas', 'Revogar acessos e recuperar ativos imediatamente após saída ou mudança de função.'),
('6.6', 'Acordos de confidencialidade ou não divulgação',                                'Pessoas', 'Exigir acordos de confidencialidade a colaboradores, fornecedores e terceiros.'),
('6.7', 'Trabalho remoto',                                                               'Pessoas', 'Implementar políticas e controlos para proteger informação em contexto de trabalho remoto.'),
('6.8', 'Reporte de eventos de segurança da informação',                                 'Pessoas', 'Estabelecer canal acessível para reporte de eventos de segurança por todos os colaboradores.'),

-- =========================================================
-- A.7 Physical Controls (14)
-- =========================================================
('7.1',  'Perímetros de segurança física',                                               'Físico', 'Definir e implementar perímetros físicos para proteger áreas com informação sensível.'),
('7.2',  'Entrada física',                                                               'Físico', 'Controlar o acesso físico a áreas seguras com mecanismos de autenticação adequados.'),
('7.3',  'Segurança de escritórios, salas e instalações',                                'Físico', 'Proteger fisicamente escritórios e instalações contra acesso não autorizado.'),
('7.4',  'Monitorização da segurança física',                                            'Físico', 'Monitorizar áreas sensíveis com sistemas de vigilância e deteção de intrusão.'),
('7.5',  'Proteção contra ameaças físicas e ambientais',                                 'Físico', 'Proteger instalações contra ameaças como incêndio, inundação e falha de energia.'),
('7.6',  'Trabalho em áreas seguras',                                                    'Físico', 'Definir procedimentos para trabalho em áreas seguras, incluindo restrição de dispositivos.'),
('7.7',  'Secretária e ecrã limpos',                                                     'Físico', 'Implementar política de secretária e ecrã limpos para reduzir exposição de informação.'),
('7.8',  'Localização e proteção de equipamentos',                                       'Físico', 'Instalar equipamentos em locais seguros e protegidos contra danos físicos e acesso não autorizado.'),
('7.9',  'Segurança de ativos fora das instalações',                                     'Físico', 'Proteger ativos utilizados fora das instalações com controlos adequados.'),
('7.10', 'Suportes de armazenamento',                                                    'Físico', 'Gerir suportes de armazenamento durante o seu ciclo de vida, incluindo eliminação segura.'),
('7.11', 'Infraestruturas de suporte',                                                   'Físico', 'Proteger infraestruturas de suporte (energia, AVAC) contra falhas e interferências.'),
('7.12', 'Segurança do cabeamento',                                                      'Físico', 'Proteger cabos de energia e comunicação contra interceção, interferência e danos.'),
('7.13', 'Manutenção de equipamentos',                                                   'Físico', 'Realizar manutenção regular de equipamentos e registar todas as intervenções.'),
('7.14', 'Eliminação ou reutilização segura de equipamentos',                            'Físico', 'Assegurar eliminação segura de dados antes de reutilizar ou descartar equipamentos.'),

-- =========================================================
-- A.8 Technological Controls (34)
-- =========================================================
('8.1',  'Dispositivos endpoint de utilizador',                                          'Tecnológico', 'Gerir e proteger dispositivos endpoint com configurações de segurança adequadas.'),
('8.2',  'Direitos de acesso privilegiado',                                              'Tecnológico', 'Restringir e monitorizar o uso de contas com privilégios elevados.'),
('8.3',  'Restrição de acesso à informação',                                             'Tecnológico', 'Restringir o acesso à informação e sistemas conforme política de controlo de acesso.'),
('8.4',  'Acesso ao código-fonte',                                                       'Tecnológico', 'Restringir e controlar o acesso ao código-fonte de aplicações.'),
('8.5',  'Autenticação segura',                                                          'Tecnológico', 'Implementar mecanismos de autenticação robustos, incluindo MFA onde adequado.'),
('8.6',  'Gestão da capacidade',                                                         'Tecnológico', 'Monitorizar e planear a capacidade dos sistemas para garantir disponibilidade.'),
('8.7',  'Proteção contra malware',                                                      'Tecnológico', 'Implementar controlos de deteção e prevenção de malware em todos os sistemas.'),
('8.8',  'Gestão de vulnerabilidades técnicas',                                          'Tecnológico', 'Identificar, avaliar e remediar vulnerabilidades técnicas em tempo útil.'),
('8.9',  'Gestão de configurações',                                                      'Tecnológico', 'Definir, documentar e manter configurações seguras de hardware e software.'),
('8.10', 'Eliminação de informação',                                                     'Tecnológico', 'Eliminar informação de forma segura quando já não for necessária.'),
('8.11', 'Mascaramento de dados',                                                        'Tecnológico', 'Aplicar técnicas de mascaramento para proteger dados sensíveis em ambientes não produtivos.'),
('8.12', 'Prevenção de fuga de dados',                                                   'Tecnológico', 'Implementar controlos para detetar e prevenir fuga de dados sensíveis.'),
('8.13', 'Cópia de segurança da informação',                                             'Tecnológico', 'Realizar cópias de segurança regulares e testar a restauração periodicamente.'),
('8.14', 'Redundância dos recursos de processamento de informação',                      'Tecnológico', 'Implementar redundância suficiente para garantir disponibilidade dos sistemas críticos.'),
('8.15', 'Registo de eventos (logging)',                                                  'Tecnológico', 'Registar eventos de segurança e reter logs pelo período adequado.'),
('8.16', 'Atividades de monitorização',                                                  'Tecnológico', 'Monitorizar redes e sistemas para detetar comportamentos anómalos.'),
('8.17', 'Sincronização de relógios',                                                    'Tecnológico', 'Sincronizar relógios de todos os sistemas com fonte de tempo fiável.'),
('8.18', 'Uso de programas utilitários privilegiados',                                   'Tecnológico', 'Controlar e registar o uso de utilitários com capacidade de sobrepor controlos.'),
('8.19', 'Instalação de software em sistemas operacionais',                              'Tecnológico', 'Controlar a instalação de software em sistemas de produção.'),
('8.20', 'Segurança de redes',                                                           'Tecnológico', 'Implementar controlos para proteger redes e serviços de rede.'),
('8.21', 'Segurança dos serviços de rede',                                               'Tecnológico', 'Identificar e incluir mecanismos de segurança nos acordos de serviços de rede.'),
('8.22', 'Segmentação de redes',                                                         'Tecnológico', 'Segmentar redes para isolar sistemas e reduzir o impacto de incidentes.'),
('8.23', 'Filtragem web',                                                                'Tecnológico', 'Filtrar o acesso a websites para reduzir exposição a conteúdo malicioso.'),
('8.24', 'Uso de criptografia',                                                          'Tecnológico', 'Implementar criptografia para proteger informação em trânsito e em repouso.'),
('8.25', 'Ciclo de vida de desenvolvimento seguro',                                      'Tecnológico', 'Integrar práticas de segurança em todas as fases do ciclo de desenvolvimento.'),
('8.26', 'Requisitos de segurança de aplicações',                                        'Tecnológico', 'Definir e implementar requisitos de segurança para aplicações desenvolvidas ou adquiridas.'),
('8.27', 'Arquitetura de sistemas seguros e princípios de engenharia',                   'Tecnológico', 'Aplicar princípios de arquitetura segura no design de sistemas.'),
('8.28', 'Codificação segura',                                                           'Tecnológico', 'Aplicar práticas de codificação segura para prevenir vulnerabilidades comuns.'),
('8.29', 'Testes de segurança em desenvolvimento e aceitação',                           'Tecnológico', 'Realizar testes de segurança durante o desenvolvimento e antes da aceitação.'),
('8.30', 'Desenvolvimento externalizado',                                                'Tecnológico', 'Supervisionar e exigir práticas de desenvolvimento seguro a fornecedores externos.'),
('8.31', 'Separação de ambientes de desenvolvimento, teste e produção',                  'Tecnológico', 'Manter ambientes separados para desenvolvimento, teste e produção.'),
('8.32', 'Gestão de mudanças',                                                           'Tecnológico', 'Controlar mudanças em sistemas de informação através de processo formal.'),
('8.33', 'Informação de teste',                                                          'Tecnológico', 'Proteger dados utilizados em testes, evitando uso de dados de produção reais.'),
('8.34', 'Proteção dos sistemas de informação durante auditoria',                        'Tecnológico', 'Proteger sistemas de produção durante atividades de auditoria e testes.')

ON CONFLICT DO NOTHING;
