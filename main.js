Array.prototype.index = 0;
Array.prototype.random = function () {
    this.index = this.index + 1 == this.length ? 0 : this.index + 1;
    return this[this.index];
}

const weight_range = 23;
const getRandomWeight = () => Math.random() * weight_range * 2 - weight_range;
const sigmoid = value => 1 / (1 + Math.pow(Math.E, -value));
const calcWrong = (i, a) => Math.pow(i - a, 2);

class Bias {
    constructor() { }
    activate() {
        return 1;
    }
}

class Neuron {
    constructor(neurons) {
        this.setInput(neurons);
    }
    setInput(neurons) {
        this.inputs = [];
        for (let input of neurons) {
            if (input instanceof Neuron || input instanceof Bias) {
                this.inputs.push(new Synapse(input, this));
            } else {
                this.inputs.push(input);
            }
        }
    }
    activate() {
        this.sum = 0;
        for (let input of this.inputs)
            if (input instanceof Synapse)
                this.sum += input.activate();
            else
                this.sum += input;
        return sigmoid(this.sum);
    }
}

let synapses = [];

class Synapse {
    constructor(a, b) {
        this.input = a;
        this.output = b;
        this.weight = getRandomWeight();
        this.lastWeight = undefined;
        synapses.push(this);
    }
    revert() {
        this.weight = this.lastWeight;
    }
    change(value) {
        this.lastWeight = this.weight;
        this.weight = value;
    }
    activate() {
        return this.input.activate() * this.weight;
    }
}

let in1 = []
in1.push(i1 = new Neuron([1]));
in1.push(i2 = new Neuron([0]));

let l1 = []
l1.push(new Neuron(in1));
l1.push(new Neuron(in1));
l1.push(new Neuron(in1));
l1.push(new Neuron(in1));
l1.push(new Neuron(in1));
l1.push(new Neuron(in1));

let o1 = new Neuron(l1);

let learning_set =
    [
        [1, 1, 1],
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ];

let last_wrong;
let wrongs;

let synapse = synapses.random();
let epoch = 0;
while (true) {
    epoch++;
    wrongs = 0;
    for (let iteration of learning_set) {
        i1.setInput([iteration[0]]);
        i2.setInput([iteration[1]]);
        let a1 = o1.activate();
        wrongs += calcWrong(iteration[2], a1);
        if (epoch % 100000 == 1) {
            console.log(iteration[0] + ' - ' + iteration[1] + ' - ' + a1)
        }
    }
    wrongs = wrongs / learning_set.length;

    if (last_wrong < wrongs) {
        synapse.revert();
    } else {
        last_wrong = wrongs;
        if (last_wrong == 0) {
            break;
        }
    }
    synapse = synapses.random();
    synapse.change(getRandomWeight());
    if (epoch % 100000 == 1) {
        console.log(last_wrong)
        console.log()
    }
}

for (let iteration of learning_set) {
    i1.setInput([iteration[0]]);
    i2.setInput([iteration[1]]);
    let a1 = o1.activate();
    wrongs += calcWrong(iteration[2], a1);
    console.log(iteration[0] + ' - ' + iteration[1] + ' - ' + a1);
}

wrongs = wrongs / learning_set.length;
console.log(epoch)


