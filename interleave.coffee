# Calculates time interval between start and end, formatted as
# 17928 -> 17s 928ms
timeElapsed = (start, end) ->
  diff = end - start
  "#{Math.floor(diff/1000)}s #{Math.floor(diff%1000)}m"

# Helpers for the permute function
arrayExcept = (A, idx) ->
  (A = A[0..]).splice idx, 1; A

flatten = (A) -> [].concat [], A...

# Given an array A, will generate all the permutations of the
# array to a certain point in the algorithm, determined by max.
# Assume A is an array such as...
#
#     A = [1, 2, 3, 4]
#
# ...then if max = 2, we will generate all the possible permutations
# such that for all P in permutations, P[0] ∈ A[0..max].
#
# Again taking max = 2 as an example, this would return...
#
#   [
#     [1, ...]...
#     [2, ...]...
#   ]
#
permute = (A, max = A.length) ->
  return A if A.length is 1
  flatten A[0..max-1].map (n,i) ->
    [n].concat(p) for p in permute(arrayExcept(A, i))

# Usage for generating permutations of an array A = [1..N], with
# one of two methods of processing.
#
#   parent: Will spawn child processes for concurrent processing
#   simple: Operates using the single process/thread
#
# To allow for timings without accounting for stdout and system
# messaging overheads, outputs will only be printed if <stdout>
# has the value 'print'.
#
#   coffee interleave.coffee <parent|simple> <N> <stdout>
#
# Use the unix 'time' command to analyses system specific timings,
# such as user/system/real differences.
[job, max, entry, exit, stdout] = process.argv[2..].map (a) ->
  if (i = parseInt a, 10) then i else a
stdout ?= entry # if not a worker

switch job

  when 'worker'
    (A = [1..max]).push (A.splice 0, entry)...
    ps = permute A, (exit - entry)
    if stdout == 'print'
      console.log JSON.stringify ps
    else
      console.log JSON.stringify ps.length

  when 'parent'

    $q = require 'q'
    spawn = (require 'child_process').spawn

    # Set the number of cores to be the minimum of either the machine, or
    # the length of the array. There is too much overhead to justify spawning
    # >max cores for values of max under 8.
    NO_OF_CORES = Math.min (require 'os').cpus().length, max

    idxs = [0..NO_OF_CORES].map (i) ->
      Math.floor ( i * max / NO_OF_CORES )

    start = Date.now()
    done = $q.all [0..NO_OF_CORES - 1].map (i) ->

      wrkr = spawn\
      ( 'coffee'
      , ['interleave.coffee', 'worker', max, idxs[i], idxs[i+1], stdout]
      , encoding: 'utf8' )

      json = '' # initialise collector for json
      wrkr.stdout.setEncoding 'utf8'

      wrkr.stdout.on 'data', (data) ->
        json += data
      wrkr.on 'close', (err) ->
        console.log "Worker #{i} has finished! [#{err}]"
        def.resolve JSON.parse json
      (def = $q.defer()).promise

    done.then (perms) ->
      duration = timeElapsed start, Date.now()
      console.log perms if stdout == 'print'
      console.log """\nDone!
      Found #{perms.reduce ((a,c) -> a+(c?.length || c)), 0} permutations!
      Duration: #{duration}"""

  when 'simple'
    console.log "Permuting [1..#{max}]..."
    start = Date.now()
    ps = permute [1..max]
    duration = timeElapsed start, Date.now()
    console.log ps if stdout == 'print'
    console.log """\nDone!
    Found #{ps.length} permutations!
    Duration: #{duration}"""
