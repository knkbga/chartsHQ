namespace nodejs tutorial

/*
 C like comments are supported
*/
// This is also a valid comment

typedef i32 int // We can use typedef to get pretty names for the types we are using
struct StatStruct {
  1: double mean = 0,
  2: double median = 0,
  3: double variance = 0
}

service statsCalculationService
{
  bool ping(1: StatStruct structure),
  StatStruct calculateStat(1: list<int> inputList),
  list<int> generateNums()
}