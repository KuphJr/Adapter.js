import test from 'ava'
import process from 'process'
import { filesFromPath, getFilesFromPath } from '../src/index.js'

test('yields files from fixtures folder', async t => {
  const files = []
  for await (const f of filesFromPath(`${process.cwd()}/test/fixtures`)) {
    files.push(f)
  }

  t.true(files.length === 2)
})

test('gets files from fixtures folder', async t => {
  const files = await getFilesFromPath(`${process.cwd()}/test/fixtures`)

  t.true(files.length === 2)
})
