import {useRouter} from 'next/router'
import Image from 'next/legacy/image'

import {getStaticPosts, getTags} from '@/lib/blog-static.js'

import colors from '@/styles/colors.js'

import Page from '@/layouts/main.js'

// Pas de pagination dans le fichier JSON // import Pagination from '@/components/pagination.js'
import BlogCard from '@/components/post-card.js'
import BlogTags from '@/components/blog/blog-tags.js'

const Blog = () => {
  const router = useRouter()
  const {query} = router
  const tagsList = getTags()
  const tags = query.tags?.split(',') || []
  const posts = getStaticPosts().filter(post => tags.length === 0 || post.tags.some(tag => tags.includes(tag.name.toLowerCase().replace('é', 'e'))))

  return (
    <Page title='Blog du PCRS' description='La liste complète des billets du blog autour du PCRS'>
      {posts ? (
        <div>
          <div className='blog-header fr-my-5w'>
            <Image
              src='/images/illustrations/blog_illustration.svg'
              height={200}
              width={200}
              alt=''
              aria-hidden='true'
            />
            <h2 className='fr-mt-5w fr-mb-0'>Blog du PCRS</h2>
          </div>

          <div className='fr-grid-row fr-grid-row--center'>
            {tagsList.length > 0 && <BlogTags selectedTags={tags} tagsList={tagsList} />}
            <div className='fr-grid-row fr-mb-6w fr-px-1w fr-px-md-5w'>
              {posts.length > 0 && posts.map(post => (
                <div key={post.id} className='fr-col-12 fr-col-md-6 fr-col-lg-3 fr-col-lg-4 fr-p-md-3w'>
                  <BlogCard post={post} />
                </div>
              ))}
              {(posts.length === 0 && tags.length === 0) && <div className='no-article'>Aucun article de blog n’est disponible</div>}
              {(posts.length === 0 && tags.length > 0) && <div className='no-article'>Aucun article ne contient ces tags</div>}
            </div>

            {/* Pas de pagination dans le fichier JSON */}
            {/* <Pagination {...pagination} /> */}
          </div>
        </div>
      ) : (
        <div className='unavailable fr-p-5w'>
          <Image
            src='/images/illustrations/500.png'
            height={456}
            width={986}
            alt=''
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto'
            }}
          />

          <div className='fr-pt-8w'>
            <p>
              <b className='fr-h3'>Le blog est actuellement inaccessible</b><br />
              <i>Merci de réessayer ultérieurement</i>
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .blog-header {
          text-align: center;
        }

        .blog-cards-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 6em;
          justify-items: center;
        }

        .no-article {
          font-style: italic;
        }

        .unavailable {
          text-align: center;
          color: ${colors.darkgrey};
        }
    `}</style>
    </Page>
  )
}

// Au revoir blog dynamique !
// export async function getServerSideProps({query}) {
//   const data = await getPosts(query)
//   const tags = query?.tags || null
//   const tagsList = await getTags()
//
//   return {
//     props: {
//       posts: data?.posts || null,
//       pagination: data?.meta.pagination || null,
//       tags: tags?.split(',') || [],
//       tagsList
//     }
//   }
// }

export default Blog
