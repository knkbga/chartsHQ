namespace nodejs tutorial

/*
 C like comments are supported
*/
// This is also a valid comment

typedef i32 int // We can use typedef to get pretty names for the types we are using

service statsCalculationService
{
  double stats(1: list<int> argList),
  list<int> genRandom()
}
