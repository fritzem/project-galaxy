
const pi = Math.PI;


//Movements that can be made by the play
//Also valid gravity values
//Very sensitive
const Dir = {
    Up : 0,
    Down: 1,
    Left: 2,
    Right: 3,
    Identity : 4,
    HardDrop: 5,
    SpinLeft : -pi / 2,
    SpinRight: pi / 2,
    MoveAugments : [[0, -1], [0, 1], [-1, 0], [1, 0], [0, 0]],
    RingBase : [[-1, -1], [1, 1], [-1, 1], [1, -1]],
    RingTraversal : [[1, 0], [-1, 0], [0, -1], [0, 1]],
    CornerRingCrunch : [[[1,1],[-1,1]],[[-1,-1],[1,-1]],[[1,-1],[1,1]],[[-1,1],[-1,-1]]],
    MoveOpposite : [1, 0, 3, 2]
}

export default Dir;