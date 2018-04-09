import transport from '../../src/assets/transport'

describe('assets/transport', () => {
  beforeEach(fetch.resetMocks)

  it('exposes get method', done => {
    const data = JSON.stringify({foo: 'bar'})
    fetch.mockResponseOnce(data)

    transport.get('https://example.com')
      .then(res => {
        expect(res.body).toEqual(data)
        done()
      })
      .catch()

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://example.com')
  })
})
