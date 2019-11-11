// Promise.allSettled is support started node 12.9. Before then, use the following polyfil
// Source: https://medium.com/trabe/using-promise-allsettled-now-e1767d43e480
const promise = new Promise((r) => { r('a')});
if (!promise.allSettled) {
    Promise.allSettled = promises =>
        Promise.all(
            promises.map((promise, i) =>
                promise
                    .then(value => ({
                        status: "fulfilled",
                        value,
                    }))
                    .catch(reason => ({
                        status: "rejected",
                        reason,
                    }))
            )
        );
}