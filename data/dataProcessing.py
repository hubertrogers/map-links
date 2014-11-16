import sys
import json

if __name__ == "__main__":
  if len(sys.argv)!=3:
      print "usage: aggregate_transfers.py geocodedLocations.json transfersDict.json"
      sys.exit(0);
  #
  coordinatesInputPath = open(sys.argv[1])
  coordinatesInput = json.load(coordinatesInputPath)
  coordinatesInputPath.close()
  #
  transfers = json.loads(open(sys.argv[2], "r").read())

  lst = []


  for placeX in sorted(coordinatesInput):
    # print placeX
    unitsX = 0
    placeXDestinationUnits = []
    placeXSourceUnits = []
    for placeY in sorted(coordinatesInput):
      # if placeY == placeX:
      #   continue
      unitsXtoY = 0
      unitsYtoX = 0
      addedSelfFlag = False
      ######## transfers is now a dict with key = place
      if placeX in transfers and placeY in transfers[placeX]:
        unitsX += transfers[placeX][placeY]
        unitsXtoY += transfers[placeX][placeY]
        placeXDestinationUnits.append([placeY, unitsXtoY])
      if placeY in transfers and placeX in transfers[placeY]:
        unitsX += transfers[placeY][placeX]
        unitsYtoX += transfers[placeY][placeX]
        placeXSourceUnits.append([placeY, unitsYtoX])
    #############
    if unitsX > 0:
      place = {}
      place['name'] = placeX
      place['units'] = str(unitsX)
      place['lat'] = str(coordinatesInput[placeX]['location']['lat'])
      place['lon'] = str(coordinatesInput[placeX]['location']['lng'])
      if len(placeXDestinationUnits) > 0:
        destinations = []
        for j, tup in enumerate(placeXDestinationUnits):
          destination = {}
          destination['name'] = tup[0]
          destination['units'] = str(tup[1])
          destination['lat'] = str(coordinatesInput[tup[0]]['location']['lat'])
          destination['lon'] = str(coordinatesInput[tup[0]]['location']['lng'])
          destinations.append(destination)
        place['destinations'] = destinations
      if len(placeXSourceUnits) > 0:
        sources = []
        for j, tup in enumerate(placeXSourceUnits):
          source = {}
          source['name'] = tup[0]
          source['units'] = str(tup[1])
          source['lat'] = str(coordinatesInput[tup[0]]['location']['lat'])
          source['lon'] = str(coordinatesInput[tup[0]]['location']['lng'])
          sources.append(source)
        place['sources'] = sources
      lst.append(place)
  print json.dumps(lst, indent=4, sort_keys=True)