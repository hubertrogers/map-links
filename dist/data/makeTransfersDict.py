import sys
import json

if __name__ == "__main__":
  if len(sys.argv)!=2:
      print "usage: aggregate_transfers.py transfers.json"
      sys.exit(0);
  #
  transfers = json.loads(open(sys.argv[1], "r").read())

  lst = {}

  for transfer in transfers:
    obj = {}
    name = ''
    for key in transfer:
      if key == 'Total' or transfer[key] == None or transfer[key] == 0:
        continue
      elif key == 'sending_country':
        name = transfer[key]
      else:
        obj[key] = transfer[key]
    lst[name] = obj
  print json.dumps(lst, indent=4, sort_keys=True)