class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: ['macaco', 'macaco', 'macaco'] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: ['gazela'] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: ['leão'] }
        ];
        this.especies = {
            'leão': { tamanho: 3, bioma: 'savana', tipo: 'carnivoro' },
            'leopardo': { tamanho: 2, bioma: 'savana', tipo: 'carnivoro' },
            'crocodilo': { tamanho: 3, bioma: 'rio', tipo: 'carnivoro' },
            'macaco': { tamanho: 1, bioma: 'savana ou floresta', tipo: 'herbivoro' },
            'gazela': { tamanho: 2, bioma: 'savana', tipo: 'herbivoro' },
            'hipopotamo': { tamanho: 4, bioma: 'savana ou rio', tipo: 'herbivoro' }
        };
    }

    analisaRecintos(animal, quantidade) {
        const especie = animal.toLowerCase();
        if (!this.especies[especie]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const infoAnimal = this.especies[especie];
        const biomaAnimal = infoAnimal.bioma;
        const tamanhoAnimal = infoAnimal.tamanho;
        const tipoAnimal = infoAnimal.tipo;
        let recintosViaveis = [];

        for (let recinto of this.recintos) {
            const biomas = recinto.bioma.split(' e ').map(bioma => bioma.trim());
            const espacamentoAnimalNoRecinto = recinto.animais.reduce((acc, curr) => acc + this.especies[curr].tamanho, 0);
            const espacamentoDisponivel = recinto.tamanhoTotal - espacamentoAnimalNoRecinto;
            if (especie === 'crocodilo' && (recinto.bioma !== 'rio')) {
                continue;
            }
            if (biomas.some(bioma => biomaAnimal.includes(bioma)) && espacamentoDisponivel >= quantidade * tamanhoAnimal) {
                let adequado = true;
                const animaisNoRecinto = recinto.animais.length;

                if (tipoAnimal === 'carnivoro') {
                    if (recinto.animais.some(animalExistente => this.especies[animalExistente].tipo === 'carnivoro' && animalExistente !== especie)) {
                        adequado = false;
                    }
                } else if (tipoAnimal === 'herbivoro') {
                    if (especie === 'macaco' && animaisNoRecinto === 0) {
                        adequado = false;
                    }
                    if (especie === 'hipopotamo' && !biomas.includes('savana e rio')) {
                        adequado = false;
                    }
                }

                if (animaisNoRecinto > 0) {
                    if (espacamentoDisponivel - (quantidade * tamanhoAnimal + 1) < 0) {
                        adequado = false;
                    }
                } else {
                    if (espacamentoDisponivel - (quantidade * tamanhoAnimal) < 0) {
                        adequado = false;
                    }
                }

                if (adequado) {
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacamentoDisponivel - quantidade * tamanhoAnimal} total: ${recinto.tamanhoTotal})`);
                }
            }
        }

        recintosViaveis.sort((a, b) => {
            const aNum = parseInt(a.match(/Recinto (\d+)/)[1]);
            const bNum = parseInt(b.match(/Recinto (\d+)/)[1]);
            return aNum - bNum;
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }
        return { erro: null, recintosViaveis };
    }
}

export { RecintosZoo };