/* 
epsilon 
This will be a floating point number that tells us the 
frequency with which we should explore one of the available arms. 
If we set epsilon = 0.1, then we’ll explore the available arms on 10% of our pulls.

counts 
A vector of integers of length N that tells us how many times 
we’ve played each of the N arms available to us in the current bandit problem. 
If there are two arms, Arm 1 and Arm 2, which have both been played twice, 
then we’ll set counts = [2, 2].

values 
A vector of floating point numbers that defines the average amount 
of reward we’ve gotten when playing each of the N arms available to us. 
If Arm 1 gave us 1 unit of reward on one play and 0 on another play, 
while Arm 2 gave us 0 units of reward on both plays, then we’ll set values = [0.5, 0.0].

select_arm 
Every time we have to make a choice about which arm to pull, 
we want to be able to simply make a call to our favorite algorithm and 
have it tell us the numeric name of the arm we should pull. 
Throughout this book, all of the bandit algorithms will implement 
a select_arm method that is called without any arguments and which returns 
the index of the next arm to pull.

update 
After we pull an arm, we get a reward signal back from our system. 
(In the next chapter, we’ll describe a testing framework we’ve built that simulates 
these rewards so that we can debug our bandit algorithms.) 
We want to update our algorithm’s beliefs about the quality of the arm we just 
chose by providing this reward information. Throughout this book, all of the bandit 
algorithms handle this by providing an update function that takes as arguments 
    (1) an algorithm object, 
    (2) the numeric index of the most recently chosen arm and 
    (3) the reward received from choosing that arm. 
The update method will take this information and make the relevant changes to 
the algorithm’s evaluation of all of the arms. */

class Epsilon_greedy {
    constructor({ epsilon, arms }) {
        this.epsilon = epsilon
        this.arms = arms
        this.counts = Array(arms).fill(0)
        this.values = Array(arms).fill(0)
    }

    select_arm() {
        if( Math.random() > this.epsilon ) {
            return this.values.indexOf(Math.max( ...this.values ))
        }else {
            return Math.floor(Math.random() * Math.floor(this.arms))
        }
    }

    update( chosen_arm, reward ) {
        const times = ++this.counts[chosen_arm]
        const new_value = this.values[chosen_arm]

        this.values[chosen_arm] = (new_value * (times - 1) + reward) / times
    }
}

class Softmax {
    constructor({ temperature, arms }) {
        this.temperature = temperature
        this.arms = arms
        this.counts = Array(arms).fill(0)
        this.values = Array(arms).fill(0)
    }

    categorical_draw( probs ) {
        const z = Math.random()
        let cum_prob = 0.0

        for( let i=0; i<probs.length; i++ ) {
            cum_prob += probs[i]
            if( cum_prob > z){
                return i
            }
        }

        return probs.length - 1
    }

    select_arm() {
        const z = this.values.map( v => Math.exp( v/this.temperature)).reduce( (a,b) => a+b )
        const probs = this.values.map( v => ( Math.exp( v/this.temperature) ) / z )

        return this.categorical_draw(probs) 
    }

    update( chosen_arm, reward ) {
        const times = ++this.counts[chosen_arm]
        const new_value = this.values[chosen_arm]

        this.values[chosen_arm] = (new_value * (times - 1) + reward) / times
    }
}


module.exports = {
    Epsilon_greedy: Epsilon_greedy,
    Softmax: Softmax
}