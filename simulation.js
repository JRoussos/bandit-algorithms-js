const Bandits = require('./bandit_algorithms')

class bernoulli_arm {
    constructor(p) {
        this.p = p
    }

    pull() {
        return Math.random() > this.p ? 0 : 1
    }
}

const simulate = ( bandit_algorithm, options, arms, horizon ) => {
    chosenArms = Array(horizon).fill()
    rewards = Array(horizon).fill()
    cumulativeRewards = Array(horizon).fill()

    final = Array(arms.length).fill(0)

    let algorithm = new bandit_algorithm(options)
    let cumulativeReward = 0

    for( let i=0; i<horizon; i++ ) {
        const random_arm = algorithm.select_arm()
        const selected_arm = arms[random_arm]
        let reward = 0
        if(selected_arm){
            reward = selected_arm.pull()
            algorithm.update(random_arm, reward)            
        }

        chosenArms[i] = random_arm
        rewards[i] = reward
        cumulativeReward += reward
        cumulativeRewards[i] = cumulativeReward
        final[random_arm] += 1
    }

    return {chosenArms, rewards, cumulativeRewards, final}
}

const NUMBER_OF_ARMS = 5
const NUMBER_OF_PULLS = 100000
const EPSILON = 0.1
const TEMPERATURE = 0.1

console.log("Number of arms: ", NUMBER_OF_ARMS)
console.log("Number of pulls: ", NUMBER_OF_PULLS)
console.log("Epsilon: ", EPSILON)
console.log("Temperature: ", TEMPERATURE)

const bernoulli_arms = Array(NUMBER_OF_ARMS).fill().map( (_, index) => new bernoulli_arm( ((index+1) * 0.1).toFixed(1) ))
// const bernoulli_arms = Array(NUMBER_OF_ARMS).fill().map( (_, index) => new bernoulli_arm( Math.random() / 10 ))

console.log("Possibility of reward for each arm: ", bernoulli_arms.map( (arm, index) => `${index}: ${arm.p}`), "\n" );
const eGreedy = simulate(Bandits.Epsilon_greedy, {epsilon: EPSILON, arms: NUMBER_OF_ARMS}, bernoulli_arms, NUMBER_OF_PULLS)
const softmax = simulate(Bandits.Softmax, {temperature: TEMPERATURE , arms: NUMBER_OF_ARMS}, bernoulli_arms, NUMBER_OF_PULLS)

console.log("eGreedy: ", eGreedy.final, "\trewarded: ", eGreedy.cumulativeRewards[NUMBER_OF_PULLS-1], "times");
console.log("Softmax: ", softmax.final, "\trewarded: ", softmax.cumulativeRewards[NUMBER_OF_PULLS-1], "times");