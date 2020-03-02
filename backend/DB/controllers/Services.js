import urlMetadata from "url-metadata";

function getMetaDataFromURL(req, res) {
  const { url } = req.query;

  urlMetadata(url).then(
    metadata => {
      res.json({
        success: 1,
        meta: {
          title: metadata.title,
          description: metadata.description,
          image: {
            url: metadata.image
          }
        }
      });
    },
    error => {
      console.log(error);
    }
  );
}

export default { getMetaDataFromURL };
