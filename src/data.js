const students = [
  ['1', 'ANGELLO GABRIEL CUTOLO TEIXEIRA', '00001164997324SP'],
  ['2', 'ARTHUR HENRIQUE MARQUES ENDRES', '00001158658783SP'],
  ['4', 'BIANCA CRISTINA DA SILVA SANTOS', '00001247024416SP'],
  ['5', 'BRAYAN DA SILVA FERREIRA', '00001132158357SP'],
  ['6', 'BRAYAN DUARTE DA SILVA', '00001141527078SP'],
  ['7', 'BRUNO LUIZ NASCIMENTO DA SILVA', '00001150747158SP'],
  ['8', 'CRISTIANO MARQUES BATISTA DE SOUZA', '00001141637789SP'],
  ['9', 'DANIEL RODRIGUES SANTOS DIAS', '00001142587484SP'],
  ['10', 'DIEGO BARRIO NOVO AMARAL DE ANDRADE', '00001159413368SP'],
  ['11', 'ESTER CODINA DE JESUS', '00001141437302SP'],
  ['12', 'FABRICIO LORENZO PARMA', '00001207876665SP'],
  ['13', 'GABRIELA PAULINA FERREIRA MARTINS', '00001158798490SP'],
  ['14', 'HYLLARY VICTORIA NERCIR DE FRANÇA', '00001207922286SP'],
  ['15', 'ISAAC BONFIM VIDOTTO', '00001141571882SP'],
  ['16', 'JHONAS KEYRRISON TROCATIS DA SILVA', '00001141455183SP'],
  ['17', 'JULIA VITORIA SEVERA LINS', '00001141611387SP'],
  ['19', 'KESIA DOS SANTOS SOSTE', '00001158837161SP'],
  ['20', 'KHIARA DE OLIVEIRA SILVA', '00001165274218SP'],
  ['21', 'LAURA BORGES AZEVEDO', '00001155509134SP'],
  ['23', 'LUAN DANTAS NICOLUCCI', '00001158855680SP'],
  ['24', 'LUAN RIBEIRO SILVA', '00001214888070SP'],
  ['25', 'MANUELA ANGELICA TRIANA DA SILVA', '00001158862015SP'],
  ['26', 'MARCELO GOMES THOMAZ', '00001150725096SP'],
  ['27', 'MARCOS CÉLIO DE JESUS', '00001141426456SP'],
  ['28', 'MARIA EDUARDA MACHADO DE LIMA', '00001132587773SP'],
  ['29', 'MATEUS DE JESUS JACINTO DOS SANTOS', '00001208280910SP'],
  ['31', 'PABLO HENRIQUE DUARTE DA SILVA', '00001208335340SP'],
  ['32', 'PAULO CÉSAR LAMBERT GONÇALVES', '00001251497718SP'],
  ['34', 'PIETRO MARTINS NOBRE', '00001141671967SP'],
  ['36', 'SOPHIA FRANÇA DE CARVALHO', '00001158908155SP'],
  ['40', 'WALLIF LEANDRO DE JESUS LESSA', '00001141637728SP'],
  ['41', 'BERNARDO GONCALVES JANELLI', '00001210074266SP']
];

export const rosterByClass = {
  '8º Ano A': students.map(([call, name, code]) => ({ call, name, email: `${code}@aluno.educacao.sp.gov.br` })),
  '8º Ano B': students.map(([call, name, code]) => ({ call, name, email: `${code}@al.educacao.sp.gov.br` }))
};

export const questions = [
{theme:'Sistema Sol–Terra–Lua', lesson:'Aula 02 · Movimentos da Terra', q:'Qual movimento da Terra está relacionado à sucessão dos dias e das noites?', options:['Translação','Precessão','Revolução lunar','Rotação'], answer:3, explain:'A rotação é o giro da Terra em torno do próprio eixo e dura aproximadamente 24 horas.'},
{theme:'Sistema Sol–Terra–Lua', lesson:'Aula 03 · Estações do ano', q:'As estações do ano acontecem principalmente por causa...', options:['das variações anuais na distância entre Terra e Sol','da inclinação do eixo terrestre combinada com a translação','da rotação diária da Terra','da posição da Lua em relação ao equador'], answer:1, explain:'A inclinação do eixo faz cada hemisfério receber diferentes ângulos de luz ao longo da translação.'},
{theme:'Sistema Sol–Terra–Lua', lesson:'Aula 06 · Fases da Lua', q:'A Lua parece mudar de fase porque...', options:['vemos diferentes porções iluminadas pelo Sol','a atmosfera terrestre bloqueia partes diferentes de sua luz','a superfície lunar muda de tamanho conforme a órbita','ela passa a produzir mais luz em determinadas posições'], answer:0, explain:'A Lua não produz luz; suas fases dependem da posição relativa entre Sol, Terra e Lua.'},
{theme:'Sistema Sol–Terra–Lua', lesson:'Aula 07 · Eclipses', q:'Em um eclipse solar, a ordem aproximada dos astros é...', options:['Sol–Terra–Lua','Terra–Lua–Sol','Sol–Lua–Terra','Lua–Terra–Sol'], answer:2, explain:'A Lua passa entre o Sol e a Terra e projeta sua sombra sobre uma parte da superfície terrestre.'},
{theme:'Tempo e clima', lesson:'Aula 09 · Clima e tempo', q:'Qual alternativa diferencia corretamente tempo atmosférico e clima?', options:['Tempo é o padrão de décadas; clima é a condição observada em um dia','Tempo e clima são sinônimos usados em escalas diferentes','Clima corresponde apenas à temperatura média de uma região','Tempo é a condição momentânea; clima é o padrão observado por longos períodos'], answer:3, explain:'Tempo descreve o estado atual ou de curto prazo; clima é o padrão de uma região ao longo de muitos anos.'},
{theme:'Tempo e clima', lesson:'Aula 10 · Previsão do tempo', q:'Qual instrumento mede a pressão atmosférica?', options:['Termômetro','Anemômetro','Barômetro','Pluviômetro'], answer:2, explain:'O barômetro mede a pressão atmosférica; o termômetro mede temperatura.'},
{theme:'Tempo e clima', lesson:'Aula 11 · Estação meteorológica', q:'O pluviômetro é usado para medir...', options:['a umidade relativa do ar','a quantidade de chuva','a pressão atmosférica','a radiação solar'], answer:1, explain:'O pluviômetro coleta e indica a precipitação em determinado período.'},
{theme:'Circulação e climas', lesson:'Aula 14 · Circulação atmosférica', q:'O aquecimento desigual da superfície terrestre contribui para...', options:['a formação de ventos e correntes de convecção','a variação das marés oceânicas','a distribuição uniforme da pressão do ar','a redução da gravidade nas áreas mais quentes'], answer:0, explain:'Diferenças de temperatura geram diferenças de pressão e movimentam massas de ar.'},
{theme:'Circulação e climas', lesson:'Aula 17 · El Niño e La Niña', q:'El Niño e La Niña estão relacionados principalmente a...', options:['mudanças na circulação lunar que alteram as marés','alterações sazonais no campo magnético terrestre','erupções vulcânicas simultâneas em vários continentes','variações na temperatura das águas do Pacífico e seus efeitos climáticos'], answer:3, explain:'São fenômenos oceânico-atmosféricos que alteram padrões de circulação e precipitação.'},
{theme:'Mudanças climáticas', lesson:'Aula 18 · Mudanças climáticas', q:'Qual ação ajuda a mitigar as mudanças climáticas?', options:['Apenas transferir cidades para regiões menos quentes','Aumentar o consumo de energia para modernizar equipamentos','Ampliar a eficiência energética e o uso de fontes renováveis','Substituir áreas naturais por plantações de uma única espécie'], answer:2, explain:'Eficiência, energias renováveis, conservação e redução de emissões ajudam a restabelecer o equilíbrio ambiental.'},
{theme:'Mudanças climáticas', lesson:'Aula 19 · Aquecimento global', q:'O aquecimento global atual está fortemente associado...', options:['às mudanças naturais da órbita terrestre, sem influência humana','à intensificação do efeito estufa por atividades humanas','à diminuição da energia emitida pelo Sol','à alteração das fases da Lua ao longo do ano'], answer:1, explain:'A queima de combustíveis fósseis e o desmatamento aumentam gases de efeito estufa.'},
{theme:'Mudanças climáticas', lesson:'Aula 20 · Equilíbrio ambiental', q:'Uma decisão ambientalmente responsável em uma escola seria...', options:['reduzir desperdícios, separar resíduos e acompanhar o consumo','separar resíduos, mas manter o desperdício de água','trocar áreas verdes por mais vagas de estacionamento','usar descartáveis para evitar o gasto de água na limpeza'], answer:0, explain:'Ações coletivas de redução, reutilização, reciclagem e uso eficiente de energia têm impacto positivo.'}
];
export const questionImages = [
  '/assets/question-01-rotation.jpg',
  '/assets/question-02-seasons.jpg',
  '/assets/question-03-moon-phases.jpg',
  '/assets/question-04-solar-eclipse.jpg',
  '/assets/question-05-weather-climate.jpg',
  '/assets/question-06-barometer.jpg',
  '/assets/question-07-rain-gauge.jpg',
  '/assets/question-08-atmospheric-convection.jpg',
  '/assets/question-09-el-nino-la-nina.jpg',
  '/assets/question-10-climate-action.jpg',
  '/assets/question-11-greenhouse-effect.jpg',
  '/assets/question-12-school-sustainability.jpg'
];
export const themes = [...new Set(questions.map(question => question.theme))];
